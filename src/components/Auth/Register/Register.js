import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5555/auth/register', {
                fullName,
                email,
                password,
            });
            
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                setMessage('Успешная регистрация. Токен сохранён.');
                navigate('/');
            } else {
                setMessage('Успешная регистрация, но токен не получен.');
            }
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Ошибка при регистрации');
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Регистрация</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Полное имя:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Электронная почта:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">Зарегистрироваться</button>
            </form>
            {message && <p className="register-message">{message}</p>}
            <p className="signup-message">
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};

export default Register;
