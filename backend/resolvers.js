/* eslint-disable no-unused-vars */
import { gql, UserInputError } from 'apollo-server-core';
import Book from './models/book.js';
import Author from './models/author.js';

export const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }

  type Token{
    value: String!
  }

  type User{
    username: String!
    favoriteGenre: String!
    id: ID!
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const countBooks  = (author) => {
  author.bookCount = Book.collection.count({author: author._id});
};

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
        books.forEach(({author}) => countBooks(author));
        if (args.genre) {
          books = books.filter((b) => b.genres.includes(args.genre));
        }
      }else if(args.genre){
        books = await Book.find({genre: {$in: args.genre}});
      }else{
        books = await Book.find({}).populate('author');
        books.forEach(({author}) => countBooks(author));
        
      }
      
      return books;
    },
    allAuthors: async (root) => {
      const authors =  await Author.find({});
      authors.forEach(author => countBooks(author));
      return authors;
    },
    //TODO: ex8.16 - implement resolvers and database storage for users
    //TODO: test login with query (don't worry about front end)
    //TODO: implement 'me' query resolver
  },

  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({name: args.author});
      let newBook;
      if (!author) {
        try{
          const newAuthor = await Author.create({ name: args.author });
          newBook = {...args, author:newAuthor._id.toString()};
        }catch(err){
          throw new UserInputError(err.message);
        }
      }else{
        newBook = {...args, author:author._id.toString()};
      }
      try{
        await Book.create(newBook);
        const book = await Book.findOne({title: newBook.title}).populate('author');
        countBooks(book.author);
        return book;
      }catch(err){
        throw new UserInputError(err.message);
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({name: args.name});
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      const result = await author.save();
      countBooks(author);
      return result;
    },
  },
};
