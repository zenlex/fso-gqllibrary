/* eslint-disable no-unused-vars */
import { gql } from 'apollo-server-core';
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
    author: Author
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int
    born: Int
    id: ID!
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
    bookCount: async (root) => Book.collection.countDocuments(),
    authorCount: (root) => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // filter by author
      let books;
      if(args.author){
        const author= await Author.findOne({name:args.author});
        books = await Book.find({author: author._id}).populate('author');
        if (args.genre) {
          books = books.filter((b) => b.genres.includes(args.genre));
        }
      }else if(args.genre){
        books = await Book.find({genre: {$in: args.genre}});
      }else{
        books = Book.find({}).populate('author');
      }
      
      return books;
    },
    allAuthors: async (root) => {
      const authors =  await Author.find({});
      authors.forEach(auth => auth.bookCount = Book.collection.countDocuments({author: auth._id}));
      return authors;
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
    editAuthor: async (root, args) => {
      const author = await Author.findOne({name: args.name});
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      return await author.save();
    },
  },
};
