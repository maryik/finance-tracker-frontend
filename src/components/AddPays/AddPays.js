// AddExpense.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddPays.css'; // Импортируем стили

const AddPay = ({ onClose }) => {
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    const handleAddPay = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            const response = await axios.post(
                'http://localhost:5555/budget/addPay',
                { amount: parseFloat(amount), title, date },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message);
            setAmount(''); // Очищаем поле ввода суммы
            setTitle('');  // Очищаем поле ввода заголовка
            setDate('');   // Очищаем поле ввода даты
            onClose();     // Закрываем форму добавления расхода
            window.location.reload();
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Ошибка при добавлении расхода');
        }
    };

    return (
        <div className="add-expense-container">
            <h3 className="add-expense-title">Добавить прибыль</h3>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Сумма прибыли"
                className="expense-input"
                required
            />
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название прибыли"
                className="expense-input"
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="expense-input"
                required
            />
            <button onClick={handleAddPay} className="button">Добавить</button>
            <button onClick={onClose} className="button cancel-button">Отмена</button>
            {message && <p className="message">{message}</p>} {/* Отображение сообщения */}
        </div>
    );
};

export default AddPay;
