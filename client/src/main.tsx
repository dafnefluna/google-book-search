import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.js';
import SearchBooks from './pages/SearchBooks.js';
import SavedBooks from './pages/SavedBooks.js';
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <h1 className='display-2'>Not Found</h1>,
        children: [
            {
                index: true,
                element: <SearchBooks />
            }, {
                path: '/saved',
                element: <SavedBooks />
            }
        ]
    }
])

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}