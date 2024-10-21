import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_USER} from '../utils/mutations';
import Auth from '../utils/auth';
import {IAddUser} from '../models/Users';
// import React from 'react';


const SignupForm = ({ }: { handleModalClose: () => void }) => {
    const [userFormData, setUserFormData] = useState<IAddUser>
        ({
            username: '',
            email: '',
            password: '',
        });
    const [addUser] = useMutation(CREATE_USER);
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    // update state based on form input changes
    const handleInputChange = (event: ChangeEvent) => {
        const { name, value } = event.target as HTMLInputElement;

        setUserFormData({
            ...userFormData,
            [name]: value,
        });
    };

    // submit form
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(userFormData);

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await addUser({
                variables: {
                    username: userFormData.username,
                    email: userFormData.email,
                    password: userFormData.password,
                },
            });

            Auth.login(data.addUser.token);
        } catch (e) {
            console.error(e);
            setShowAlert(true);
        }
    };
    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your signup!
                </Alert>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='username'>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Your username'
                        name='username'
                        onChange={handleInputChange}
                        value={userFormData.username || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Your email address'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.email || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.username && userFormData.email && userFormData.password)}
                    type='submit'
                    variant='success'>
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SignupForm;