// todo: create typeDefs of all components. add gql in front of the back tick for readibility. delete when running
import gql from 'graphql-tag';

// after type Auth, do I need to do an input UserInput for authentication?
//type defs is a way to enforce the data im getting back and specific to graphql
const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Auth {
    token: String
    user: User
}

type Book {
    _id: ID
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

input BookInput {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

type Query {
    users: [User]
    singleUser(_id: ID!): User
    me: User
}

type Mutation{
    addUser(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, input: BookInput!): User
    removeBook(userId: ID!, bookId: String!): User
}
`;
export default typeDefs;