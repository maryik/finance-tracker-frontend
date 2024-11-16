import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="menu-container">
            <span className="menu-icon" onClick={toggleMenu}>☰</span>
            {menuOpen && (
                <div className={`dropdown-menu ${menuOpen ? 'show' : ''}`} ref={dropdownRef}>
                    <ul>
                        <li onClick={() => { navigate('/'); setMenuOpen(false); }}>Главная</li>
                        <li onClick={() => { navigate('/goals'); setMenuOpen(false); }}>Цели</li>
                        <li onClick={() => { navigate('/history'); setMenuOpen(false); }}>История платежей</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Menu;
