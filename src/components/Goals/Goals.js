import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Goals.css';
import Menu from '../../shared/Menu/Menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [userBudget, setUserBudget] = useState(0);
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', price: '', description: '', deadline: '' });

    useEffect(() => {
        fetchGoals();
        fetchUserBudget();
    }, []);

    const fetchGoals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5555/goals/getAll', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoals(response.data.goals);
        } catch (error) {
            console.error('Ошибка при получении целей:', error);
            toast.error(error.response?.data?.msg || 'Ошибка при получении целей');
        }
    };

    const fetchUserBudget = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5555/budget/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserBudget(response.data.budget);
        } catch (error) {
            console.error('Ошибка при получении бюджета пользователя:', error);
            toast.error(error.response?.data?.msg || 'Ошибка при получении бюджета');
        }
    };

    const openModal = (goal) => {
        if (!goal.isCompleted) {
            setSelectedGoal(goal);
        }
    };

    const closeModal = () => {
        setSelectedGoal(null);
        setNewGoal({ title: '', price: '', description: '', deadline: '' });
    };

    const markAsCompleted = async () => {
        try {
            if (userBudget < selectedGoal.price) {
                toast.error('Недостаточно средств для завершения этой цели.');
                return;
            }

            const response = await axios.put(`http://localhost:5555/goals/${selectedGoal._id}/complete`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const updatedBudget = response.data.updatedBudget.amount;
            setUserBudget(updatedBudget);
            toast.success(response.data.msg || 'Цель успешно завершена!');
            fetchGoals();
            closeModal();
        } catch (error) {
            console.error('Ошибка при завершении цели:', error);
            toast.error(error.response?.data?.msg || 'Ошибка при завершении цели');
        }
    };

    const openAddGoalModal = () => {
        setIsAddGoalModalOpen(true);
    };

    const closeAddGoalModal = () => {
        setIsAddGoalModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGoal((prev) => ({ ...prev, [name]: value }));
    };

    const addGoal = async () => {
        try {
            const token = localStorage.getItem('token');
            const formattedDeadline = new Date(newGoal.deadline).toLocaleDateString('ru-RU');
            const goalToAdd = { ...newGoal, deadline: formattedDeadline };

            await axios.post('http://localhost:5555/goals/add', goalToAdd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchGoals();
            closeAddGoalModal();
        } catch (error) {
            console.error('Ошибка при добавлении цели:', error);
        }
    };

    const isDeadlineExpired = (deadline) => {
        const now = new Date();
        return new Date(deadline) < now;
    };

    const getRemainingTime = (deadline) => {
        const now = new Date();
        const timeRemaining = new Date(deadline) - now;
        if (timeRemaining > 0) {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            return `${days} дн. ${hours} ч. ${minutes} мин.`;
        } else {
            return null;
        }
    };

    const getRemainingTimeInModal = (deadline) => {
        const now = new Date();
        const timeRemaining = new Date(deadline) - now;
        if (timeRemaining > 0) {
            return getRemainingTime(deadline);
        }
        return null;
    };

    return (
        <div className="goals-container">
            <Menu />
            <div className="goals-header">
                <h2>Цели</h2>
                <button className="add-goal-button" onClick={openAddGoalModal}>Добавить цель</button>
            </div>

            {goals.length === 0 ? (
                <p className="no-goals-message">У вас пока нет целей. Добавьте цель, нажав кнопку "Добавить цель".</p>
            ) : (
                <ul className="goal-list">
                    {goals.map((goal) => {
                        const isExpired = isDeadlineExpired(goal.deadline);
                        return (
                            <li
                                key={goal._id}
                                className={`goal-item ${goal.isCompleted ? 'completed' : ''} ${isExpired ? 'expired' : ''}`}
                                onClick={() => openModal(goal)}
                            >
                                <span className="goal-price">{goal.price} руб.</span>
                                <span className="goal-title">{goal.title}</span>
                                <span className="goal-deadline">{new Date(goal.deadline).toLocaleDateString()}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            <ToastContainer />

            {isAddGoalModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeAddGoalModal}>&times;</span>
                        <h3>Добавить цель</h3>
                        <input
                            type="text"
                            name="title"
                            placeholder="Заголовок"
                            value={newGoal.title}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Стоимость"
                            value={newGoal.price}
                            onChange={handleInputChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Описание"
                            value={newGoal.description}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="deadline"
                            value={newGoal.deadline}
                            onChange={handleInputChange}
                        />
                        <button onClick={addGoal}>Добавить</button>
                    </div>
                </div>
            )}

            {selectedGoal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{selectedGoal.title}</h3>
                        <p>{selectedGoal.description}</p>
                        <span className={`remaining-time ${isDeadlineExpired(selectedGoal.deadline) ? 'text-red' : ''}`}>
                            {getRemainingTimeInModal(selectedGoal.deadline) || 'Срок истёк'}
                        </span>
                        <button onClick={markAsCompleted}>Завершить</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
