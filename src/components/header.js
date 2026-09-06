import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./components.css"


function Header () {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropped_1, setIsDropped_1] = useState(false);
    const [isDropped_2, setIsDropped_2] = useState(false);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    const toggleDrop1 = () => {
        setIsDropped_1(prev => !prev); // переключаем на основе предыдущего
        setIsDropped_2(false);         // закрываем второй
    };

    const toggleDrop2 = () => {
        setIsDropped_2(prev => !prev);
        setIsDropped_1(false);
    };
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Если клик по ссылке внутри дропдауна — не закрываем (браузер сам перейдёт)
            if (e.target.closest('a')) return;
        
            if (dropdownRef1.current && !dropdownRef1.current.contains(e.target)) {
                setIsDropped_1(false);
            }
            if (dropdownRef2.current && !dropdownRef2.current.contains(e.target)) {
                setIsDropped_2(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <nav className={`siteHeader ${isOpen ? "siteHeaderOpen" : ""}`}>
            {/* Кнопка бургера — видна только на мобилках через CSS */}
            <button className={`menuToggle ${isOpen ? "menuToggleOpen" : ""}`} onClick={toggleMenu}>
                {isOpen ? "✕ Закрыть" : "☰ Меню"}
            </button>

            {/* Группа навигации с динамическим классом */}
            <div className={`navGroup ${isOpen ? "navGroupOpen" : ""}`}>
                <Link to="/" className="navBtn" onClick={closeMenu}>Главная</Link>
                <span ref={dropdownRef1}  className={`navBtn navDrpDwn ${isDropped_2 ? "navDrpOpn" : ""}`}>
                    <button className={`navBtn navDrpDwnBtn ${isDropped_2 ? "navDrpBtnClck" : ""}`} onClick={toggleDrop2}>Блог</button>
                    <div className="drpDwnCnt">
                        <Link to="/blog" className="navBtn" onClick={closeMenu}>Посты</Link>
                        <Link to="/guestbook" className="navBtn" onClick={closeMenu}>Гостевая книга</Link>
                        <Link to="/gallery" className="navBtn" onClick={closeMenu}>Галерея</Link>
                        <a href="/rss.xml" className="navBtn" onClick={closeMenu} target="_blank" rel="noopener noreferrer">RSS</a>
                    </div>
                </span>
                <span ref={dropdownRef2}  className={`navBtn navDrpDwn ${isDropped_1 ? "navDrpOpn" : ""}`}>
                    <button className={`navBtn navDrpDwnBtn ${isDropped_1 ? "navDrpBtnClck" : ""}`} onClick={toggleDrop1}>Проекты</button>
                    <div className="drpDwnCnt">
                        <Link to="/projects/games" className="navBtn" onClick={closeMenu}>Игры</Link>
                        <Link to="/projects/mods" className="navBtn" onClick={closeMenu}>Моды</Link>
                        <Link to="/projects/levels" className="navBtn" onClick={closeMenu}>Уровни</Link>
                        <Link to="/projects/other" className="navBtn" onClick={closeMenu}>Прочие</Link>
                    </div>
                </span>
                <Link to="/backlog" className="navBtn" onClick={closeMenu}>Бэклог</Link>
                <Link to="/changelog" className="navBtn" onClick={closeMenu}>Обновления</Link>
                {/* <a href="/about" className="navBtn">Обо мне</a> */}
            </div>
        </nav>
    )
}

export default Header