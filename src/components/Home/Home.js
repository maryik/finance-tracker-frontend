import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddExpense from '../AddExpense/AddExpense';
import AddPay from '../AddPays/AddPays';
import Modal from '../../shared/Modal/Modal';
import Menu from '../../shared/Menu/Menu'; // Импортируем компонент Menu
import './Home.css';

const Home = () => {
    const [balance, setBalance] = useState(null);
    const [message, setMessage] = useState('');
    const [amountToAdd, setAmountToAdd] = useState('');
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddPay, setShowAddPay] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            const response = await axios.get('http://localhost:5555/budget/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBalance(response.data.amount);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Ошибка при получении баланса');
        }
    };

    const addBudget = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            await axios.post(
                'http://localhost:5555/budget/add',
                { amount: parseFloat(amountToAdd) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage('Бюджет успешно добавлен!');
            setAmountToAdd('');
            fetchBalance();
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Ошибка при добавлении бюджета');
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('token');
            setBalance(null);
            setMessage('Вы вышли из системы.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
    };

    return (
        <div className="home-container">
            <Menu />
            <div className="balance-container">
                <div className="balance-title">Ваш баланс:</div>
                {balance !== null ? (
                    <p className="balance-amount">{balance} руб.</p>
                ) : (
                    <p className="message">{message || 'Загрузка баланса...'}</p>
                )}
            </div>

            <hr className="divider" />

            <div>
                {balance === null ? (
                    <div className="budget-form">
                        <input
                            type="number"
                            value={amountToAdd}
                            onChange={(e) => setAmountToAdd(e.target.value)}
                            placeholder="Сумма бюджета"
                            className="budget-input"
                        />
                        <button onClick={addBudget} className="button">Добавить бюджет</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => setShowAddExpense(true)} className="button">Добавить растрату</button>
                        <button onClick={() => setShowAddPay(true)} className="button">Добавить прибыль</button>
                    </div>
                )}
            </div>

            {/* Модальные окна для добавления расходов и прибыли */}
            <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)}>
                <AddExpense onClose={() => setShowAddExpense(false)} />
            </Modal>

            <Modal isOpen={showAddPay} onClose={() => setShowAddPay(false)}>
                <AddPay onClose={() => setShowAddPay(false)} />
            </Modal>

            <button onClick={handleLogout} className="button button-logout">Выйти</button>
        </div>
    );
};

export default Home;
