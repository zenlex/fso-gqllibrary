/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ApolloServer, gql } from 'apollo-server';
import { typeDefs, resolvers } from './resolvers.js';
import process from 'process';
dotenv.config();
const MONGO_URL = process.env.MONGODB_URI;

console.log('MongoDB URL:', MONGO_URL);

mongoose.connect(MONGO_URL)
  .then(() => 
    console.log('Connected to MongoDB')
  ).catch(err => 
    console.log('error connecting to MongoDB:', err)
  );
  
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
