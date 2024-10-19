import React, { useState, FormEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useGoogleBooks} from '../utils/api.js';
import { SAVE_BOOK } from '../utils/mutations.js';
import Auth from '../utils/auth.js';
import { GOOGLE_BOOKS_QUERY, QUERY_ME } from '../utils/queries.js';


const SearchBooks: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const { loading, data: searchedBooks } = useGoogleBooks(searchInput);

     // gql mutation to add a book to the user's saved books
    const [addBook] = useMutation(SAVE_BOOK, {
        refetchQueries: [{query: GOOGLE_BOOKS_QUERY}, {query: QUERY_ME}],
    });

    // gql query to get the logged in user's saved books
    const { data: savedBooksData } = useQuery(QUERY_ME, {
        skip: !Auth.loggedIn(),
    });

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!searchInput) return;
        // The search is triggered by updating the searchInput state
    };

    // add book to the saved list
    const savingBook = async (bookId: string): Promise<boolean> => {
        if (!searchedBooks) {
            console.error('No search results available');
            return false;
        }

        const bookToSave = searchedBooks.find((book) => book.id === bookId);

        // first, check if the book exists
        if (!bookToSave) {
            console.error('Book not found in the search results');
            return false;
        }

        // get token from Auth
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            console.error('User is not logged in');
            return false;
        }

        try {
            // prepare the input for the googlebooks mutation 
            const input = {
                bookId: bookToSave.id,
                title: bookToSave.volumeInfo.title,
                authors: bookToSave.volumeInfo.authors || [],
                description: bookToSave.volumeInfo.description || '',
                image: bookToSave.volumeInfo.imageLinks?.thumbnail.replace('zoom=1', 'zoom=0') || '',
            };

            const userId = savedBooksData?.me?._id;

            // call the addbook mutation (mutation from useMutation hook)
            const { data } = await addBook({
                variables: { userId, input },
            });

            // if the book was successfully saved, log success message with book title
            if (data && data.saveBook) {
                console.log(`Book saved successfully: ${bookToSave.volumeInfo.title}`);
            }
        } catch (err) {
            console.error('Error saving the book:', err);
        }
        return false;
    };

    // check if book is already saved
    const isBookSaved = (bookId: string) => {
        return savedBooksData?.books.some((book: any) => book.bookId === bookId);
    };

    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container>
                    <h1>Search for Books!</h1>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control
                                    name="searchInput"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    type="text"
                                    size="lg"
                                    placeholder="Search for a book"
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button type="submit" variant="success" size="lg">
                                    Submit Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>

            {/* results after book search*/}
            <Container>
                <h2 className="pt-5">
                    {loading? 'Loading...' : searchedBooks?.length? `Viewing ${searchedBooks.length} results:` : 'Search for a book to begin'}
                </h2>
                <Row>
                    {searchedBooks && searchedBooks.map((book) => (
                        <Col md="4" key={book.id}>
                            <Card border="dark">
                                {book.volumeInfo.imageLinks?.thumbnail && (
                                    <Card.Img
                                        className={'img-fluid'}
                                        src={book.volumeInfo.imageLinks.thumbnail.replace('zoom=1', 'zoom=0')}
                                        alt={`The cover for ${book.volumeInfo.title}`}
                                        variant="top"
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{book.volumeInfo.title}</Card.Title>
                                    <p className="small">
                                        Author(s): {book.volumeInfo.authors?.join(', ')}
                                    </p>
                                    <Card.Text>{book.volumeInfo.description}</Card.Text>
                                    {Auth.loggedIn() && (
                                        <Button
                                            disabled={isBookSaved(book.id)}
                                            onClick={() => savingBook(book.id)}
                                            variant="primary"
                                            className="btn-block btn-info"
                                        >
                                            {isBookSaved(book.id) ? 'Book already saved' : 'Save this Book!'}
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default SearchBooks;