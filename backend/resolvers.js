/* eslint-disable no-unused-vars */
import { gql } from 'apollo-server-core';
import {books, authors} from './dummydata.js';
import Book from './models/book.js';
import Author from './models/author.js';

export const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int
    born: Int
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
    ): Book
    editAuthor(name: String!, setBornTo: Int): Author
  }
`;

export const resolvers = {
  Query: {
    bookCount: (root) => books.length,
    authorCount: (root) => authors.length,
    allBooks: async (root, args) => {
      // filter by author
      let books = await Book.find({});
      let results = args.author
        ? books.filter((b) => b.author === args.author)
        : books;
      //filter by genre
      if (args.genre) {
        results = results.filter((b) => b.genres.includes(args.genre));
      }

      return results;
    },
    allAuthors: (root) => {
      return authors.map((author) => ({
        ...author,
        bookCount: books.filter((b) => b.author === author.name).length,
      }));
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      console.log('addBook args: ', args);
      const author = await Author.findOne({name: args.author});
      console.log('Author search result:', author);
      let newBook;
      if (!author) {
        const newAuthor = await Author.create({ name: args.author });
        console.log('new author created: ', newAuthor);
        newBook = {...args, author:newAuthor._id.toString()};
      }else{
        newBook = {...args, author:author._id.toString()};
      }
      const result = await Book.create(newBook);
      console.log('new book created:', result);
      return result;
    },
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name);
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      console.log(authors);
      return author;
    },
  },
};
