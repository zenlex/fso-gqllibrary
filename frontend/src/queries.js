import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($username: String!, $password: String!){
  login(username: $username, password: $password){
    value
  }
}
`
export const ALL_AUTHORS = gql`
query{
  allAuthors{
    name
    born
    bookCount
  }
}`

export const ALL_BOOKS = gql`
query{
  allBooks{
    title
    author{
      name
      bookCount
    }
    published
  }
}`

export const ADD_BOOK = gql`
  mutation addNewBook($title: String!, $author: String!, $published: Int, $genres:[String]){
    addBook(
      title:$title, 
      author:$author, 
      published:$published, 
      genres:$genres
      ){
        title, 
        author,
        published,
        genres
      }
  }`

export const EDIT_AUTHOR = gql`
  mutation editAuthorInfo($name:String!, $setBornTo: Int!){
    editAuthor(
      name:$name, 
      setBornTo: $setBornTo
      ){
        name,
        born
      }
}
`