import React, { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useLocation  } from 'react-router-dom';
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

function ProjectLevel () {
    const { projectId } = useParams();
    const location = useLocation();
    const [projectData, setProjectData] = useState(null);
    const [fullContent, setFullContent] = useState(projectData?.comment || "");
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

    const openLightbox = useCallback((src) => {
        const images = extractImages(fullContent); // массив { src, caption }
        
        // Добавляем обложку
        if (projectData?.cover && !images.find(img => img.src === projectData.cover)) {
            images.unshift({
                src: projectData.cover,
                caption: projectData.title || '',
            });
        }

        const index = images.findIndex(img => img.src === src);
        setLightboxData({ images, index: index >= 0 ? index : 0 });
    }, [fullContent, projectData]);

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
                const res = await fetch('/json/projectsMods.json')
                const data = await res.json();
                const foundPost = data.find(p => p.id === projectId);
    
                if (!foundPost) {
                    if (!cancelled) {
                        setProjectData(null);
                        setIsLoading(false);
                    }
                    return;
                }
    
                if (!cancelled) {
                    setProjectData(foundPost);
                    setFullContent(foundPost.content || "");
                }
    
                if (foundPost.mdPath) {
                    const mdRes = await fetch(`/projectsContent/Mods/${foundPost.mdPath}`);
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
    }, [projectId]);

    useEffect(() => {
        let cancelled = false;
    
        const loadPost = async () => {
            try {
                const res = await fetch('/json/projectsLevels.json')
                const data = await res.json();
                const foundPost = data.find(p => p.id === projectId);
    
                if (!foundPost) {
                    if (!cancelled) {
                        setProjectData(null);
                        setIsLoading(false);
                    }
                    return;
                }
    
                if (!cancelled) {
                    setProjectData(foundPost);
                    setFullContent(foundPost.content || "");
                }
    
                if (foundPost.mdPath) {
                    const mdRes = await fetch(`/projectsContent/Levels/${foundPost.mdPath}`);
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
    }, [projectId]);
    useEffect(() => {
        if (!projectData) return;

        // SEO title
        document.title = `${projectData.title} - AzurePlay | Markdown Blog`;
        // SEO description
        const description = (projectData.comment || '').substring(0, 200) + '...';
        let metaDesc = document.head.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);
        const keywords = projectData.tags?.join(', ') || '';
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
        };
    
        // Сохраняем текущие значения, чтобы вернуть их при уходе
        const previousValues = {};
        const metaProperties = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
        metaProperties.forEach(prop => {
            const existing = document.querySelector(`meta[property="${prop}"]`);
            previousValues[prop] = existing ? existing.getAttribute('content') : null;
        });
    
        // Устанавливаем для поста
        setMeta('og:title', projectData.title);
        setMeta('og:description', projectData.comment?.substring(0, 200) + "..." || '');
        setMeta('og:image', projectData.cover || '');
        setMeta('og:url', window.location.href);
        setMeta('og:type', 'article');
        const isoDate = projectData.date_added
            ? new Date(projectData.date_added).toISOString() 
            : '';
        setMeta('article:published_time', isoDate);
        if (projectData.authors && projectData.authors.length > 0) {
            setMeta('article:author', projectData.authors.slice(0, 5).join(', '));
        }
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', projectData.title);
        setMeta('twitter:description', projectData.comment?.substring(0, 200) + "..." || '');
        setMeta('twitter:image', projectData.cover || '');
    
        // При размонтировании возвращаем базовые значения
        return () => {
            metaProperties.forEach(prop => {
                if (previousValues[prop]) {
                    setMeta(prop, previousValues[prop]);
                }
            });
        };
    }, [projectData]);
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

    // Если загрузка завершена, а пост не найден
    if (!isLoading && !projectData) {
        return <Navigate to="/404" />;
    }

    // Пока идет самый первый запрос
    if (isLoading && !projectData) {
        return <Layout><div className="windowBase"><div className="windowContent">Загрузка...</div></div></Layout>;
    }
    return ( 
    <div>
        <Layout>
            <div className="windowBase">
                    <div className="windowName pageName windowNameFlex" style={{marginBottom: `0`}}>
                        <h1>{projectData?.title}</h1>
                        <div className="postDownloadButton">
                            <a href={`/projectsContent/Levels/${projectData.mdPath}`} download={projectData.mdPath} ><IoMdDownload /></a>
                        </div>
                    </div>
                    <div className="windowContent" style={{marginBottom: `1em`}}>
                        
                        <div className="bigPostCover"><img src={projectData.cover} alt="Обложка Проекта" onClick={() => openLightbox(projectData.cover)}/></div>
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
                        <div className="bigPostAuthorNDate">
                            <div>
                                <span>Авторы:</span>
                                <div style={{display: `flex`, flexWrap: `wrap`, alignContent: `center`, alignItems:`center`, justifyContent: `space-between`, gap:`1em`}}>
                                    {projectData.authors && projectData.authors.map((author, index) => (
                                    <span key={index}>{author}</span>
                                ))}
                                </div>
                            </div>
                            <span>Начало разработки: {new Date(projectData.date_added).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span>Последнее обновление: {new Date(projectData.date_last_update).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <Badges/>
                </div>
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

export default ProjectLevel