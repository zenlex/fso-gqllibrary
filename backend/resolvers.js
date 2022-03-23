/* eslint-disable no-unused-vars */
import { AuthenticationError, gql, UserInputError } from 'apollo-server-core';
import Book from './models/book.js';
import Author from './models/author.js';
import User from './models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'process';
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

dotenv.config();

const { JWT_SECRET } = process.env;
const countBooks = (author) => {
  author.bookCount = Book.collection.count({ author: author._id });
};

const resolvers = {
  Query: {
    bookCount: async (root) => Book.collection.countDocuments(),
    authorCount: (root) => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // filter by author
      let books;
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        books = await Book.find({ author: author._id }).populate('author');
        books.forEach(({ author }) => countBooks(author));
        if (args.genre) {
          books = books.filter((b) => b.genres.includes(args.genre));
        }
        // filter by genre only
      } else if (args.genre) {
        books = await Book.find({ genres: { $in: [args.genre] } }).populate(
          'author'
        );
      } else {
        books = await Book.find({}).populate('author');
        books.forEach(({ author }) => countBooks(author));
      }

      return books;
    },
    allAuthors: async (root) => {
      const authors = await Author.find({});
      authors.forEach((author) => countBooks(author));
      return authors;
    },
    me: async (root, args, { currentUser }) => {
      return currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const author = await Author.findOne({ name: args.author });
      let newBook;
      if (!author) {
        try {
          const newAuthor = await Author.create({ name: args.author });
          newBook = { ...args, author: newAuthor._id.toString() };
        } catch (err) {
          throw new UserInputError(err.message);
        }
      } else {
        newBook = { ...args, author: author._id.toString() };
      }
      try {
        await Book.create(newBook);
        const book = await Book.findOne({ title: newBook.title }).populate(
          'author'
        );
        countBooks(book.author);
        pubsub.publish('BOOK_ADDED', { bookAdded: book });
        return book;
      } catch (err) {
        throw new UserInputError(err.message);
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      const result = await author.save();
      countBooks(author);
      return result;
    },
    createUser: async (root, args) => {
      const newUser = await User.create(args).catch((err) => {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      });
      return newUser;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

export default resolvers;
