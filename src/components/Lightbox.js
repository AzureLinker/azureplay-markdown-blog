import React, { useState, useEffect, useCallback } from 'react';
import { IoMdDownload } from "react-icons/io";
import { FaCaretLeft } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import "./components.css"

export default function Lightbox({ images, initialIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);

    // Приводим все элементы к { src, caption }
    const normalizedImages = images.map(img => 
        typeof img === 'string' ? { src: img, caption: '' } : img
    );

    const currentImage = normalizedImages[currentIndex];

    const goTo = useCallback((index) => {
        if (index >= 0 && index < normalizedImages.length) {
            setCurrentIndex(index);
            setZoom(1); // сбрасываем зум
        }
    }, [normalizedImages.length]);

    const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
    const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

    // Закрытие по Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') goPrev();
            else if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, goPrev, goNext]);

    // Зум колесом мыши
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        setZoom(prev => Math.min(5, Math.max(0.5, prev - e.deltaY * 0.005)));
    }, []);

    useLockBodyScroll(true);

    if (!currentImage) return null;

    return (
        <div
            className="lightbox-overlay"
            onClick={onClose}
            onWheel={handleWheel}
            onTouchStart={(e) => {
                e.currentTarget.dataset.touchStartX = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchStartX = parseFloat(e.currentTarget.dataset.touchStartX);
                if (!isNaN(touchStartX)) {
                    const diff = touchStartX - touchEndX;
                    if (diff > 50) goNext();
                    else if (diff < -50) goPrev();
                }
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                cursor: 'zoom-out',
            }}
        >
            {/* Кнопка закрытия */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className='lightbox-Close'
                title="Закрыть"
            >
                ✕
            </button>
            

            {/* Кнопка скачивания */}
            <a
                href={currentImage.src}
                download
                onClick={(e) => e.stopPropagation()}
                className='lightbox-Dwnld'
                title="Скачать изображение"
            >
                <IoMdDownload />
            </a>

            {/* Стрелка назад */}
            {normalizedImages.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    disabled={currentIndex === 0}
                    style={{
                        color: currentIndex === 0 ? '#555' : '#fff',
                        cursor: currentIndex === 0 ? 'default' : 'pointer',
                    }}
                    className="lightbox-Back"
                    title="Предыдущее"
                >
                    <FaCaretLeft />
                </button>
            )}

            {/* Стрелка вперёд */}
            {normalizedImages.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    disabled={currentIndex === normalizedImages.length - 1}
                    style={{
                        color: currentIndex === normalizedImages.length - 1 ? '#555' : '#fff',
                        cursor: currentIndex === normalizedImages.length - 1 ? 'default' : 'pointer',
                    }}
                    className="lightbox-Next"
                    title="Следующее"
                >
                    <FaCaretRight />
                </button>
            )}

            {/* Счётчик */}
            {normalizedImages.length > 1 && (
                <div
                    className="lightbox-Counter"
                >
                    {currentIndex + 1} / {normalizedImages.length}
                </div>
            )}

            {/* Картинка с зумом */}
            <img
                src={currentImage.src}
                alt={currentImage.caption || 'Просмотр изображения'}
                style={{
                    maxWidth: `${90 * zoom}vw`,
                    maxHeight: `${90 * zoom}vh`,
                    objectFit: 'contain',
                    cursor: zoom === 1 ? 'zoom-in' : 'zoom-out',
                    transition: 'transform 0.2s',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setZoom(prev => prev === 1 ? 2 : 1);
                }}
            />

            {/* Подпись */}
            {currentImage.caption && (
                <div
                    className='lightbox-Caption'
                >
                    {currentImage.caption}
                </div>
            )}
        </div>
    );
}