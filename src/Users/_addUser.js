// _addUser.js
import React, { useState } from 'react';
import axios from 'axios';

function _addUser(props) {
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const newUser = {
            username,
            age: parseInt(age),
            email,
            password,
        };

        try {
            const response = await axios.post('http://localhost:3000/users', newUser);
            console.log('Usuario creado:', response.data);
            setSuccessMessage('Usuario creado exitosamente!');
            // Limpiar el formulario después de la creación exitosa
            setUsername('');
            setAge('');
            setEmail('');
            setPassword('');
            // Opcional: Cerrar el modal o realizar otra acción
            if (props.onUserAdded) {
                props.onUserAdded(response.data);
            }
        } catch (error) {
            console.error('Error al crear usuario:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error al crear el usuario. Por favor, intenta nuevamente.');
            }
        }
    };

    return (
        <div className='addUserForm'>
            <h1>Add New User</h1>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add User</button>
            </form>
        </div>
    );
}

export default _addUser;