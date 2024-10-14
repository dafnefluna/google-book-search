import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
});

// todo: Note: all pages will render via <outlet> unless I set that up differently

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="flex-column justify-center align-center min-100-vh bg-primary">
                <Outlet />
            </div>
        </ApolloProvider>
    );
}

export default App;
