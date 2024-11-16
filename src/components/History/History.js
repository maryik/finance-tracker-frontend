import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';
import Menu from '../../shared/Menu/Menu';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            const response = await axios.get('http://localhost:5555/budget/getAllExpensesAndPays', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { expenses, pays } = response.data;

            const mergedTransactions = [
                ...expenses.map(item => ({ ...item, type: 'expense' })),
                ...pays.map(item => ({ ...item, type: 'income' }))
            ];

            setTransactions(mergedTransactions);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Ошибка при получении транзакций');
        }
    };

    return (
        <div className="history-container">
            <Menu /> {/* Меню теперь находится внутри блока */}
            <h2>История транзакций</h2>
            {message && <p className="message">{message}</p>}
            <div className="transaction-list-container">
                {transactions.length > 0 ? (
                    <ul className="transaction-list">
                        {transactions.map((transaction) => (
                            <li
                                key={transaction._id}
                                className={`transaction-item ${transaction.type === 'expense' ? 'expense' : 'income'}`}
                            >
                                <span className="transaction-amount">
                                    {transaction.type === 'expense' ? '-' : '+'}
                                    {transaction.amount} руб.
                                </span>
                                <span className="transaction-title">{transaction.title}</span>
                                <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="message">Нет транзакций для отображения.</p>
                )}
            </div>
        </div>
    );
};

export default History;
