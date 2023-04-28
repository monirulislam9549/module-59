import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Register = () => {
    // const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    // 1.prevent page refresh
    const handleSubmit = (event) => {
        event.preventDefault()
        setSuccess('')
        setError('')
        // 2.collect from data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        // const name = event.target.name.value;
        console.log(name, email, password);

        // validate
        if (!/(?=.*[A-Z])/.test(password)) {
            setError('Please at least add one uppercase')
            // toast.error('Please at least add one uppercase')
            return;
        }
        else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
            // toast.error('Please at least two numbers')
            setError('Please at least add two numbers')
            return;
        }
        else if (password.length < 6) {
            // toast.error('Please provide at least 6 character')
            setError('Please provide at least 6 character')
            return;
        }


        // 3.create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const loggedUser = result.user
                console.log(loggedUser);
                setError('');
                event.target.reset()
                setSuccess('User created successfully')
                // toast.success('User created successfully')
                sendVerificationEmail(loggedUser)
                updateUserData(loggedUser, name)
            })
            .catch(error => {
                console.error(error.message);
                setError(error.message)
            })
    }

    const sendVerificationEmail = (user) => {
        sendEmailVerification(user)
            .then(result => {
                alert('Please Verify your email address')
                console.log(result)
            })
    }

    const updateUserData = (user, name) => {
        updateProfile(user, {
            displayName: name
        })
            .then(() => {
                console.log('user name updated');
            })
            .catch(error => {
                setError(error.message)
            })
    }


    const handleEmailChange = (event) => {
        console.log(event.target.value);
        // setEmail(event.target.value)
    }

    const handlePasswordBlur = (event) => {
        console.log(event.target.value);
    }
    return (
        <div className='w-50 mx-auto'>
            <h1>Please Register</h1>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mb-4 rounded ps-2' onChange={handleEmailChange} type="text" name="name" id="name" placeholder='Your Name' required />
                <br />
                <input className='w-50 mb-4 rounded ps-2' onChange={handleEmailChange} type="email" name="email" id="email" placeholder='Your Email' required />
                <br />
                <input className='w-50 mb-4 rounded ps-2' onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder='Your Passwords' required />
                <br />
                <input className='btn btn-primary' type="submit" value="Register" />
            </form>
            <p><small>Please already have an account? Please <Link to="/login">Login</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
            <ToastContainer />
        </div>
    );
};

export default Register;