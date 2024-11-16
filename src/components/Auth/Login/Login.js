import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5555/auth/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            setToken(token);  // Обновляем token в App
            setMessage('Успешный вход!');
            navigate('/');  // Переходим на главную страницу
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Ошибка при входе');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Вход</h2>
            <form className="login-form" onSubmit={handleSubmit}>
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
                <button type="submit" className="submit-button">Войти</button>
            </form>
            {message && <p className="login-message">{message}</p>}
            <p className="signup-message">
                Нет аккаунта? <Link to="/register">Зарегистрируйтесь здесь</Link>
            </p>
        </div>
    );
};

export default Login;
