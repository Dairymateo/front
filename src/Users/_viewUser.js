// _viewUser.js
import axios from 'axios';
import React, { useEffect, useState } from 'react'



function _viewUser(props) {
    

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Use the user's _id from props to fetch data
                const response = await axios.get(`http://localhost:3000/users/${props.UserPassword}`);
                if (response) {
                    console.log("User data:", response.data);
                    setUserData(response.data);
                }
            } catch (e) {
                console.error("Error fetching user data:", e);
            }
        };

        if (props.UserPassword) { // Only fetch if an ID is provided
            fetchUserData();
        }
    }, [props.UserPassword]); // Re-fetch if the UserPassword prop changes

    return (
        <div className='userView'>
            <h1>User Details</h1>
            {userData ? (
                <div className='InfoInterna'>
                    <p>ID: {userData._id}</p>
                    <p>Username: {userData.username}</p>
                    <p>Age: {userData.age}</p>
                    <p>Email: {userData.email}</p>
                    <p>Password: {userData.password}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    )
}

export default _viewUser;