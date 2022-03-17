/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from './models/user.js';
import { ApolloServer, gql } from 'apollo-server';
import { typeDefs, resolvers } from './resolvers.js';
import process from 'process';
dotenv.config();
const {MONGO_URL, JWT_SECRET} = process.env;

mongoose.connect(MONGO_URL)
  .then(() => 
    console.log('Connected to MongoDB')
  ).catch(err => 
    console.log('error connecting to MongoDB:', err)
  );
  
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({req}) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = await jwt.verify(
        auth.substring(7), JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
