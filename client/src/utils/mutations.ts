import { gql } from '@apollo/client';

// todo: mutations for creating, updating, and deleting data from the backend
export const CREATE_USER = gql `
mutation addUser(username: String!, email: String!, password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token 
        user {
            _id
            username
            email
        }
    }
}`;

export const LOGIN = gql `
mutation login(email: String!, password: String!){
    auth(email: $email, password: $password) {
        email
        password
    }
}`;

export const SAVE_BOOK = gql `
mutation SaveBook(userId:ID!, $input:BookInput) {
    saveBook(userId: $userId, input: $input) {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            title
            authors
            description
            image
            link
        }
    }
}`;

export const  REMOVE_BOOK = gql `
mutation removeBook(userId: ID!, bookId: String!) {
    removeBook(userId: $userId, bookId: $bookId ) {
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            title
            authors
            description
            image
            link
            }
    }
}`;

