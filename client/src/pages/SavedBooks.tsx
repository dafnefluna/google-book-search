import { useMutation } from "@apollo/client";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { REMOVE_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries.js"
import { useSavedBooks } from "../utils/api";
import Auth from "../utils/auth";
import React from "react";

const SavedBooks = () => {
    // gql query to get the logged-in user's saved books
    const { loading, error, data } = useSavedBooks();

    // gql mutation to remove a book
    const [removeBook] = useMutation(REMOVE_BOOK);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Something went wrong...</h2>;
    }

    const userData = data?.me;

    // handle deleting a book
    const handleDeleteBook = async (bookId: string) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            // remove the book mutation
            await removeBook({
                variables: { bookId },
                update(cache, { data: { removeBook } }) {
                    try {
                        // update the GET_ME cache to reflect the removed book
                        cache.writeQuery({
                            query: QUERY_ME,
                            data: { me: removeBook },
                        });
                    } catch (e) {
                        console.error("Error updating cache after deleting book", e);
                    }
                },
            });
            return true;
        } catch (err) {
            console.error("Error deleting book", err);
            return false;
        }
    };

    // render saved books or a message if no books 
    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container>
                    {userData?.username ? (
                        <h1>{userData.username}'s saved books</h1>
                    ) : (
                        <h1>Saved books</h1>
                    )}
                </Container>
            </div>
            <Container>
                <h2 className="pt-5">
                    {userData?.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"
                        }:`
                        : "You have no saved books!"}
                </h2>
                <Row>
                    {userData?.savedBooks.map(
                        (book: {
                            bookId: string;
                            image?: string;
                            title: string;
                            authors: string[];
                            description: string;
                        }) => (
                            <Col md="4" key={book.bookId}>
                                <Card border="dark">
                                    {book.image && (
                                        <Card.Img
                                            src={book.image}
                                            alt={`The cover for ${book.title}`}
                                            variant="top"
                                        />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className="small">Authors: {book.authors.join(", ")}</p>
                                        <Card.Text>{book.description}</Card.Text>
                                        <Button
                                            className="btn-block btn-danger"
                                            onClick={() => handleDeleteBook(book.bookId)}
                                        >
                                            Delete this Book!
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    )}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;