import React, { useState, useEffect, useCallback } from "react";
import {useLocation  } from 'react-router-dom';
import ScrollToTop from "react-scroll-to-top";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite from 'rehype-rewrite';
import CalloutBlock from '../components/CalloutBlock';
import Layout from "../components/layout";
import Badges from "../components/bades";
import { IoMdDownload } from "react-icons/io";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";


function Gallery () {
    usePageMeta({
        title: 'Галлерея AzurePlay | Markdown Blog',
        description: 'Сборник лучших картинок и скриншотов AzurePlay по мнению создательницы.',
        keywords: ['скриншоты', 'галерея', 'картинки', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Галлерея AzurePlay',
        description: 'Сборник лучших картинок и скриншотов AzurePlay по мнению создательницы.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/gallery',
        type: 'website',
    });
    const [content, setContent] = useState("");
    const location = useLocation();
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [lightboxImages, setLightboxImages] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxCaption, setLightboxCaption] = useState('');
    function extractImages(markdown) {
        if (!markdown) return [];
        const images = [];
        
        // Markdown: ![alt](url) или ![alt](url "title")
        const mdRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g;
        let match;
        while ((match = mdRegex.exec(markdown)) !== null) {
            images.push({
                src: match[2],
                caption: match[1] || match[3] || '',
            });
        }

        // HTML: <img src="url" alt="caption" title="title">
        const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*(?:title=["']([^"']*)["'])?/g;
        while ((match = htmlRegex.exec(markdown)) !== null) {
            images.push({
                src: match[1],
                caption: match[2] || match[3] || '',
            });
        }

        // Убираем дубликаты по src
        const unique = [];
        const seen = new Set();
        images.forEach(img => {
            if (!seen.has(img.src)) {
                seen.add(img.src);
                unique.push(img);
            }
        });
        return unique;
    }

    // Открыть лайтбокс
    const openLightbox = useCallback((src) => {
        const images = extractImages(content);
        const index = images.findIndex(img => img.src === src);
        setLightboxImages(images);
        setLightboxIndex(index >= 0 ? index : 0);
        setLightboxSrc(src);
        setLightboxCaption(index >= 0 ? images[index].caption : '');
    }, [content]);

    // Закрыть лайтбокс
    const closeLightbox = useCallback(() => {
        setLightboxSrc(null);
    }, []);

    const goToImage = useCallback((newIndex) => {
        if (newIndex < 0 || newIndex >= lightboxImages.length) return;
        
        const image = lightboxImages[newIndex];
        if (image) {
            setLightboxIndex(newIndex);
            setLightboxSrc(image.src);
            setLightboxCaption(image.caption);
        }
    }, [lightboxImages]); // 👈 Зависимость от lightboxImages

    // Делегирование клика на изображения внутри Markdown
    const handleMarkdownClick = useCallback((e) => {
        const img = e.target.closest('img');
        if (img && img.src) {
            openLightbox(img.src);
        }
    }, [openLightbox]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxSrc) return;
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                const newIndex = lightboxIndex - 1;
                if (newIndex >= 0) {
                    goToImage(newIndex);
                }
            } else if (e.key === 'ArrowRight') {
                const newIndex = lightboxIndex + 1;
                if (newIndex < lightboxImages.length) {
                    setLightboxIndex(newIndex);
                    goToImage(newIndex);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxSrc, lightboxIndex, lightboxImages, closeLightbox]);

    useEffect(() => {
        fetch(`/pageContent/gallery.md`)
            .then((response) => response.text())
            .then((text) => setContent(text))
            .catch((err) => console.error("Ошибка загрузки md:", err));
    }, []); // Пустой массив значит "выполнить один раз"

    useEffect(() => {
    // Функция для плавного скролла к элементу по хешу
        const scrollToHash = () => {
            const fullHash = window.location.hash; // Получаем всё, что после # (напр. #/post/1#fn-1)
            const parts = fullHash.split('#');

            // Если в строке больше одной решетки (значит есть якорь сноски)
            if (parts.length > 2) {
                const id = parts[parts.length - 1]; // Берем последний кусок (fn-1)
                const element = document.getElementById(id);
                if (element) {
                    // Небольшая задержка, чтобы Markdown успел отрендериться
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }
            }
        };

        // Слушаем изменение хеша в адресной строке
        window.addEventListener("hashchange", scrollToHash);

        // Проверяем скролл при первой загрузке (если перешли по ссылке со сноской)
        scrollToHash();

        return () => window.removeEventListener("hashchange", scrollToHash);
    }, [content]);
    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Галерея</h1></div>
            <div className="markdown-body" data-theme="dark" style={{ marginBottom: `1em`, borderRadius: `1em`}} onClick={handleMarkdownClick}>
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[
                        rehypeRaw,
                        [rehypeRewrite, {
                            rewrite: (node) => {
                                // Ищем все ссылки <a>, которые начинаются с # (сноски и якоря)
                                if (node.type === 'element' && node.tagName === 'a') {
                                    const href = node.properties.href;
                                    if (href && href.startsWith('#')) {
                                        // Превращаем "#fn-1" в "#/post/1#fn-1" для HashRouter
                                        node.properties.href = `#${location.pathname}${href}`;
                                    }
                                }
                                // Добавляем класс к картинкам для стилизации курсора
                                if (node.type === 'element' && node.tagName === 'img') {
                                    node.properties.className = node.properties.className || '';
                                    node.properties.className = 'gallery-image';
                                    node.properties.className += ' post-image-clickable';
                                    node.properties.loading = 'lazy';
                                }
                            }
                        }]
                    ]}
                    components={{
                        img: ({ src, alt }) => (
                            <div className="gallery-item">
                                <img src={src} alt={alt} loading="lazy" />
                            </div>
                        ),
                        blockquote: CalloutBlock,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
        {/* Лайтбокс */}
        {lightboxSrc && (
            <div
                className="lightbox-overlay"
                onClick={closeLightbox}
                onTouchStart={(e) => {
                    const touch = e.touches[0];
                    // Сохраняем начальную позицию касания
                    e.currentTarget.dataset.touchStartX = touch.clientX;
                }}
                onTouchEnd={(e) => {
                    const touchEndX = e.changedTouches[0].clientX;
                    const touchStartX = parseFloat(e.currentTarget.dataset.touchStartX);
                    if (!isNaN(touchStartX)) {
                        const diff = touchStartX - touchEndX;
                        // Свайп влево (следующая картинка)
                        if (diff > 50 && lightboxIndex < lightboxImages.length - 1) {
                            goToImage(lightboxIndex + 1);
                        }
                        // Свайп вправо (предыдущая картинка)
                        else if (diff < -50 && lightboxIndex > 0) {
                            goToImage(lightboxIndex - 1);
                        }
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
                    cursor: 'pointer',
                }}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '30px',
                        fontSize: '40px',
                        color: '#fff',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10000,
                    }}
                >
                    ✕
                </button>
                <a
                    href={lightboxSrc}
                    download
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'absolute',
                        top: '30px',
                        right: '80px',
                        fontSize: '40px',
                        color: '#fff',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10000,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                    }}
                    title="Скачать изображение"
                >
                    <IoMdDownload />
                </a>
                {/* Кнопка "Назад" */}
                {lightboxImages.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const newIndex = lightboxIndex - 1;
                            goToImage(newIndex);
                        }}
                        disabled={lightboxIndex === 0}
                        style={{
                            color: lightboxIndex === 0 ? '#555' : '#fff',
                            cursor: lightboxIndex === 0 ? 'default' : 'pointer',
                        }}
                        className="lightbox-Back"
                    >
                        ⯇
                    </button>
                )}
                {/* Кнопка "Вперёд" */}
                {lightboxImages.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const newIndex = lightboxIndex + 1;
                            goToImage(newIndex);
                        }}
                        disabled={lightboxIndex === lightboxImages.length - 1}
                        style={{
                            color: lightboxIndex === lightboxImages.length - 1 ? '#555' : '#fff',
                            cursor: lightboxIndex === lightboxImages.length - 1 ? 'default' : 'pointer',
                        }}
                        className="lightbox-Next"
                    >
                        ⯈
                    </button>
                )}
                {/* Счётчик */}
                {lightboxImages.length > 1 && (
                    <div
                        className="lightbox-Counter"
                    >
                        {lightboxIndex + 1} / {lightboxImages.length}
                    </div>
                )}
                <img
                    src={lightboxSrc}
                    alt="Просмотр изображения"
                    style={{
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                        cursor: 'default',
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
                {lightboxCaption && (
                    <div style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#fff',
                        fontSize: '14px',
                        zIndex: 10000,
                        background: 'rgba(0,0,0,0.7)',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        maxWidth: '80%',
                        textAlign: 'center',
                    }}>
                        {lightboxCaption}
                    </div>
                )}
            </div>
        )}
    </div>
    )
};

export default Gallery