
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function _editUser(props) {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Nuevo estado para la contraseña
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (props.userId) {
            setUserId(props.userId);
            fetchUserData(props.userId);
        } else {
            setUsername('');
            setAge('');
            setEmail('');
            setPassword(''); // Limpiar también la contraseña
        }
    }, [props.userId]);

    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/users/${id}`);
            if (response.data) {
                setUsername(response.data.username);
                setAge(response.data.age);
                setEmail(response.data.email);
                // No precargamos la contraseña por seguridad
            } else {
                setErrorMessage(`Usuario con ID ${id} no encontrado.`);
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setErrorMessage('Error al obtener datos del usuario.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const updatedUser = {
            username,
            age: parseInt(age),
            email,
            password: password || undefined, // Solo incluir la contraseña si se ha modificado
        };

        try {
            const response = await axios.patch(`http://localhost:3000/users/${userId}`, updatedUser);
            console.log('Usuario actualizado:', response.data);
            setSuccessMessage('Usuario actualizado exitosamente!');
            if (props.onUserUpdated) {
                props.onUserUpdated(response.data);
            }
            props.onHide();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error al actualizar el usuario. Por favor, intenta nuevamente.');
            }
        }
    };

    return (
        <div className='editUserForm'>
            <h1>Edit User</h1>
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
                    <label htmlFor="password">New Password (optional):</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                    />
                </div>
                <button type="submit" className="submit-button">Save Changes</button>
            </form>
        </div>
    );
}

export default _editUser;