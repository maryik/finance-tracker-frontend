import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login/Login';
import Home from './components/Home/Home';
import Register from './components/Auth/Register/Register';
import History from './components/History/History';
import Goals from './components/Goals/Goals';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/history" element={<History />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
