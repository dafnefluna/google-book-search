import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// if some issue try changing navbar to appnavbar

const httpLink = createHttpLink({
    uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
// I removed this : { headers?: Record<string, string> } after the })
const authLink = setContext((_, { headers = {} }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('id_token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

function App() {
    console.log('App Rendered')
    return (
        <ApolloProvider client={client}>
            <Navbar />
            <div className="flex-column justify-center align-center">
                <Outlet />
            </div>
        </ApolloProvider>
    );
}

export default App;