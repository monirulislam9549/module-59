import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';


const auth = getAuth(app)
const Login = () => {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const emailRef = useRef();
    const handleLogin = (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);

        // password validate
        if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            setError('Please at least add two uppercase')
            return;
        }
        else if (!/(?=.*[!@#$&*])/.test(password)) {
            setError('Please add least one special character')
            return;
        }
        else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
            setError('Please add at least two numbers')
            return;
        }
        else if (!/(?=.*[a-z].*[a-z].*[a-z])/.test(password)) {
            setError('Please at least three lower letter')
            return;
        }
        else if (password.length < 8) {
            setError('Please provide at least 8 character')
            return;
        }

        // sign user in firebase
        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                // event.target.reset();
                setError('')
                setSuccess('Login in Successfully')
            })
            .catch(error => {
                console.error(error.message)
                setError(error.message)
            })
    }

    const handleResetPassword = (event) => {
        const email = (emailRef.current.value);
        if (!email) {
            alert('Please provide your email address to reset password')
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Please Check your email')
            })
            .catch(error => {
                console.error(error.message)
                setError(error.message)
            })
    }

    return (
        <div className='w-25 mx-auto'>
            <h1>Login Form</h1>
            <Form onSubmit={handleLogin}>
                <Form.Group className='mb-3' controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name='email'
                        required
                        ref={emailRef}
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className='mb-3' controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name='password'
                        required
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <p><small>Forget password? Please <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button></small></p>
            <p><small>New to this website? Please <Link to="/register">Register</Link> </small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Login;