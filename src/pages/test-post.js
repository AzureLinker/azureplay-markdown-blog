import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link  } from 'react-router-dom';
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite from 'rehype-rewrite';
import "./pages.css";
import "../components/markdown.css"
import { IoMdDownload } from "react-icons/io";
import { IoMdShare } from "react-icons/io";
import CalloutBlock from '../components/CalloutBlock';
import TableOfContents from "../components/tableContents";
import { generateId } from "../components/idGenerate";

function getNodeText(node) {
    if (!node) return '';
    if (node.type === 'text') return node.value;
    if (node.children && Array.isArray(node.children)) {
        return node.children.map(getNodeText).join('');
    }
    return '';
}

function TestPost () {
    const { postId } = useParams();
    const location = useLocation();
    const validId = parseInt(postId);
    const [postData, setPostData] = useState(null);
    const [fullContent, setFullContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [headings, setHeadings] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const toggleChapters = () => setIsOpen(!isOpen);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [lightboxImages, setLightboxImages] = useState([]); // все URL'ы картинок
    const [lightboxIndex, setLightboxIndex] = useState(0);    // индекс текущей 
    function extractImageUrls(markdown) {
        if (!markdown) return [];
        const urls = [];
        const mdRegex = /!\[.*?\]\(([^)]+)\)/g;
        const htmlRegex = /<img[^>]+src=["']([^"']+)["']/g;
        let match;
        while ((match = mdRegex.exec(markdown)) !== null) {
            urls.push(match[1]); // строка
        }
        while ((match = htmlRegex.exec(markdown)) !== null) {
            urls.push(match[1]); // строка
        }
        return [...new Set(urls)]; // массив строк
    }

    const openLightbox = useCallback((src) => {
        const images = extractImageUrls(fullContent); // массив строк

        // Добавляем обложку как строку, если её нет
        if (postData?.cover && !images.includes(postData.cover)) {
            images.unshift(postData.cover); // строка
        }

        const index = images.indexOf(src);
        setLightboxImages(images);
        setLightboxIndex(index >= 0 ? index : 0);
        setLightboxSrc(src);
    }, [fullContent, postData]);

    // Закрыть лайтбокс
    const closeLightbox = useCallback(() => {
        setLightboxSrc(null);
    }, []);

    // Закрытие по Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && lightboxSrc) {
                closeLightbox();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxSrc, closeLightbox]);

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
                    setLightboxIndex(newIndex);
                    setLightboxSrc(lightboxImages[newIndex]);
                }
            } else if (e.key === 'ArrowRight') {
                const newIndex = lightboxIndex + 1;
                if (newIndex < lightboxImages.length) {
                    setLightboxIndex(newIndex);
                    setLightboxSrc(lightboxImages[newIndex]);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxSrc, lightboxIndex, lightboxImages, closeLightbox]);

    useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
        try {
            const res = await fetch('/json/posts.json');
            const data = await res.json();
            const foundPost = data.find(p => p.id === validId);

            if (!foundPost) {
                if (!cancelled) {
                    setPostData(null);
                    setIsLoading(false);
                }
                return;
            }

            if (!cancelled) {
                setPostData(foundPost);
                setFullContent(foundPost.content || "");
            }

            if (foundPost.mdPath) {
                const mdRes = await fetch(`/content/${foundPost.mdPath}`);
                if (!mdRes.ok) throw new Error('MD файл не найден');
                const text = await mdRes.text();
                const cleanText = text.replace(/^---[\s\S]*?---/, '').trim();
                if (!cancelled) {
                    setFullContent(cleanText);
                }
            }
        } catch (err) {
            console.error("Ошибка загрузки:", err);
        } finally {
            if (!cancelled) setIsLoading(false);
        }
    };

    setIsLoading(true);
    loadPost();

    return () => { cancelled = true; };
}, [validId]);

useEffect(() => {
    if (!postData) return;

    // SEO title
    document.title = `${postData.title} - AzurePlay | Markdown Blog`;
    // SEO description
    const description = (postData.content || '').substring(0, 200) + '...';
    let metaDesc = document.head.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
    const keywords = postData.tags?.join(', ') || '';
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    const setMeta = (property, content) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
        if (!document.head.contains(meta)) {
            document.head.appendChild(meta);
        }
    };

    // Сохраняем текущие значения, чтобы вернуть их при уходе
    const previousValues = {};
    const metaProperties = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    metaProperties.forEach(prop => {
        const existing = document.querySelector(`meta[property="${prop}"]`);
        previousValues[prop] = existing ? existing.getAttribute('content') : null;
    });

    // Устанавливаем для поста
    setMeta('og:title', postData.title);
    setMeta('og:description', postData.content?.substring(0, 200) + "..." || '');
    setMeta('og:image', postData.cover || '');
    setMeta('og:url', window.location.href);
    setMeta('og:type', 'article');
    const isoDate = postData.date 
        ? new Date(postData.date).toISOString() 
        : '';
    setMeta('article:published_time', isoDate);
    setMeta('article:author', postData.author || '');
    if (postData.tags && postData.tags.length > 0) {
        setMeta('article:tag', postData.tags.slice(0, 5).join(', '));
    }
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', postData.title);
    setMeta('twitter:description', postData.content?.substring(0, 200) + "..." || '');
    setMeta('twitter:image', postData.cover || '');

    // При размонтировании возвращаем базовые значения
    return () => {
        metaProperties.forEach(prop => {
            if (previousValues[prop]) {
                setMeta(prop, previousValues[prop]);
            }
        });
    };
}, [postData]);

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
    }, [fullContent]); // Перезапускаем, когда контент загружен

    function extractHeadings(markdown) {
        if (!markdown) return [];
    
        const lines = markdown.split('\n');
        const headingLines = [];

        lines.forEach((line, index) => {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = generateId(text); // <-- здесь
                headingLines.push({ level, text, id });
            }
        });

    // Строим дерево: вложенные заголовки становятся детьми предыдущего родителя
        const root = { children: [] };
        const stack = [root]; // стек родителей

        headingLines.forEach(heading => {
            const node = { ...heading, children: [] };

            // Ищем родителя: последний элемент в стеке с уровнем < текущего
            while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
                stack.pop();
            }

            // Добавляем как ребёнка к текущему родителю
            stack[stack.length - 1].children.push(node);
            // Запоминаем как потенциального родителя для следующих
            stack.push(node);
        });

        return root.children;
    }

    // После загрузки fullContent:
    useEffect(() => {
        if (fullContent) {
            const tree = extractHeadings(fullContent);
            setHeadings(tree);
        }
    }, [fullContent]);


    // Пока идет самый первый запрос
    if (isLoading && !postData) {
        return <Layout><div className="windowBase"><div className="windowContent">Загрузка...</div></div></Layout>;
    }
    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>{postData.title}</h1></div>
            <div className="windowGroup-2row">
                <div className="windowBase windowPostNew">
                    <div className="windowName pageName windowNameFlex" style={{marginBottom: `0`}}>
                        <div className="postDownloadButtonNew">
                            <a href={`/content/${postData.mdPath}`} download={postData.mdPath}>
                                <IoMdDownload/>
                                <span>Скачать</span>
                            </a>
                        </div>
                        <div className="postDownloadButtonNew">
                            <Link to={`/post/${postId}`}>
                                <span>⇌ Старый дизайн</span>
                            </Link>
                        </div>
                        <div className="postDownloadButtonNew">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                if (navigator.share) {
                                    navigator.share({
                                        title: `{postData.title}`,
                                        url: window.location.href,
                                        text: 'Смотри, что есть в AzurePlay!',
                                    }).catch(() => {});
                                } else {
                                    // Fallback: копируем ссылку
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Ссылка скопирована!');
                                }
                                
                            }}
                            title="Поделиться">
                                <IoMdShare />
                                <span>Поделиться</span>
                            </button>
                        </div>
                    </div>
                    <div className="windowContent" style={{marginBottom: `1em`}}>
                        <div className="bigPostCover"><img src={postData.cover} alt="Обложка поста" style={{ cursor: 'pointer' }} onClick={() => openLightbox(postData.cover)}/></div>
                        <div className="markdown-body big-post-body" data-theme="dark" style={{marginBottom: `1em`}} onClick={handleMarkdownClick}>
                            {/* Настройка ReactMarkdown с rehypeRewrite */}
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
                                                node.properties.className += ' post-image-clickable';
                                                node.properties.loading = 'lazy';
                                            }
                                            if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
                                                const text = getNodeText(node);
                                                node.properties.id = generateId(text);
                                            }
                                        }
                                    }]
                                ]}
                                components={{
                                    blockquote: CalloutBlock,
                                }}
                            >
                                {fullContent}
                            </ReactMarkdown>
                        </div>
                        <div className="bigPostTags">
                            {postData.tags && postData.tags.map((tag, index) => (
                                    <span key={index} className="bigPostTag">{tag}</span>
                                ))}
                        </div>
                        <div className="bigPostAuthorNDate">
                            <span>{postData.author}</span>
                            <span>{new Date(postData.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                <div className="windowBase windowBlogTags windowPostChapters">
                    {/* Кнопка бургера — видна только на мобилках через CSS */}
                    <button className={`chapterToggle ${isOpen ? "chapterToggleOpen" : ""}`} onClick={toggleChapters}>
                        {isOpen ? "✕ Закрыть" : "🕮 Оглавление"}
                    </button>
                    <div className="windowName windowChaptersName" style={{marginBottom: `0`}}>
                        <span>Оглавление</span>
                    </div>
                    <div className={`windowContent chapterGroup ${isOpen ? "chapterGroupOpen" : ""}`} >
                        {headings.length > 0 ? (
                            <TableOfContents items={headings} pathname={location.pathname} />
                        ) : (
                            <span>Нет заголовков, или они не размечены</span>
                        )}
                    </div>
                </div>
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
                            setLightboxIndex(lightboxIndex + 1);
                            setLightboxSrc(lightboxImages[lightboxIndex + 1]);
                        }
                        // Свайп вправо (предыдущая картинка)
                        else if (diff < -50 && lightboxIndex > 0) {
                            setLightboxIndex(lightboxIndex - 1);
                            setLightboxSrc(lightboxImages[lightboxIndex - 1]);
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
                            if (newIndex >= 0) {
                                setLightboxIndex(newIndex);
                                setLightboxSrc(lightboxImages[newIndex]);
                            }
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
                            if (newIndex < lightboxImages.length) {
                                setLightboxIndex(newIndex);
                                setLightboxSrc(lightboxImages[newIndex]);
                            }
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
            </div>
        )}
    </div>
    )
};

export default TestPost