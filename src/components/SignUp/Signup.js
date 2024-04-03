import React, { useState } from 'react';
import axios from 'axios'
const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a data object with the username and password
        const data = {
            username,
            password
        };

        try {
            // Send a POST request to the backend with the data
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            //xem JSON
            console.log(JSON.stringify(data));
            // Handle the response from the backend
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log('Signup successful', jsonResponse);
                
            } else {
                // Signup failed, handle the error
                console.error('Signup failed');
            }
        } catch (error) {
            // Handle any network or server errors
            console.error('There was an error!', error);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <br />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;