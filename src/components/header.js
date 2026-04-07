import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./components.css"


function Header () {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    return (
        <nav className={`siteHeader ${isOpen ? "siteHeaderOpen" : ""}`}>
            {/* Кнопка бургера — видна только на мобилках через CSS */}
            <button className={`menuToggle ${isOpen ? "menuToggleOpen" : ""}`} onClick={toggleMenu}>
                {isOpen ? "✕ Закрыть" : "☰ Меню"}
            </button>

            {/* Группа навигации с динамическим классом */}
            <div className={`navGroup ${isOpen ? "navGroupOpen" : ""}`}>
                <Link to="/" className="navBtn" onClick={closeMenu}>Главная</Link>
                <Link to="/blog" className="navBtn" onClick={closeMenu}>Блог</Link>
                <Link to="/projects" className="navBtn" onClick={closeMenu}>Проекты</Link>
                <Link to="/backlog" className="navBtn" onClick={closeMenu}>Бэклог</Link>
                <Link to="/changelog" className="navBtn" onClick={closeMenu}>Обновления</Link>
                {/* <a href="/about" className="navBtn">Обо мне</a> */}
            </div>
        </nav>
    )
}

export default Header