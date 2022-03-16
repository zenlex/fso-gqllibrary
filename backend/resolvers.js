/* eslint-disable no-unused-vars */
import { gql } from 'apollo-server-core';
import {books, authors} from './dummydata.js';

export const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Book {
    title: String!
    author: String
    published: Int
    genres: [String]
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
    allBooks: (root, args) => {
      // filter by author
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
    addBook: (root, args) => {
      console.log('addBook args: ', args);
      const newBook = { ...args };
      books.push(newBook);
      const author = authors.find((a) => a.name === args.author);
      if (!author) {
        authors.push({ name: args.author });
        // console.log('Author Added:', {authors});
      }
      console.log(newBook);
      return newBook;
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
