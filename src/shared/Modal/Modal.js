// Modal.js
import React from 'react';
import './Modal.css'; // Импортируем стили модального окна

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Если модальное окно закрыто, ничего не рендерим

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✖</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
