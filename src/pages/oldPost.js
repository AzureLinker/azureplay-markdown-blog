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
import CalloutBlock from '../components/CalloutBlock';
import Lightbox from "../components/Lightbox";

function OldPost () {
    const { postId } = useParams();
    const location = useLocation();
    const validId = parseInt(postId);
    const [postData, setPostData] = useState(null);
    const [fullContent, setFullContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const [lightboxImages, setLightboxImages] = useState([]); // все URL'ы картинок
    const [lightboxIndex, setLightboxIndex] = useState(0);    // индекс текущей
    const [lightboxData, setLightboxData] = useState(null);

    function extractImages(markdown) {
        if (!markdown) return [];
        const images = [];
        
        // Markdown: ![alt](url)
        const mdRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = mdRegex.exec(markdown)) !== null) {
            images.push({
                src: match[2],
                caption: match[1] || '',
            });
        }

        // HTML: <img src="url" alt="caption">
        const htmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?/g;
        while ((match = htmlRegex.exec(markdown)) !== null) {
            images.push({
                src: match[1],
                caption: match[2] || '',
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
        const images = extractImages(fullContent); // массив { src, caption }
        
        // Добавляем обложку
        if (postData?.cover && !images.find(img => img.src === postData.cover)) {
            images.unshift({
                src: postData.cover,
                caption: postData.title || '',
            });
        }

        const index = images.findIndex(img => img.src === src);
        setLightboxData({ images, index: index >= 0 ? index : 0 });
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
        // Гарантируем, что мета в head
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


    // Пока идет самый первый запрос
    if (isLoading && !postData) {
        return <Layout><div className="windowBase"><div className="windowContent">Загрузка...</div></div></Layout>;
    }
    return ( 
    <div>
        <Layout>
            <div className="windowBase">
                <div className="windowName pageName windowNameFlex" style={{marginBottom: `0`}}>
                    <h1>{postData.title}</h1>
                    <div className="postOldActionButton">
                        <div className="postDownloadButton">
                            <a href={`/content/${postData.mdPath}`} download={postData.mdPath}><IoMdDownload/></a>
                        </div>
                        <div className="postDownloadButtonNew">
                            <Link to={`/testpost/${postId}`}>
                                <span>⇌ Новый дизайн</span>
                            </Link>
                        </div>
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
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
        {lightboxData && (
            <Lightbox
                images={lightboxData.images}
                initialIndex={lightboxData.index}
                onClose={() => setLightboxData(null)}
            />
        )}
    </div>
    )
};

export default OldPost