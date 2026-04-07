import React, { useState, useEffect } from "react";
import { useParams, Navigate, useLocation  } from 'react-router-dom';
import Layout from "../components/layout";
import Badges from "../components/bades";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite from 'rehype-rewrite';
import "./pages.css";
import "../components/markdown.css"
import { IoMdDownload } from "react-icons/io";

function Post () {
    const { postId } = useParams();
    const location = useLocation(); // Получаем текущий путь для коррекции хешей
    const validId = parseInt(postId);
    // Ищем метаданные поста в JSON
    const [postData, setPostData] = useState(null);

    // Состояние для полного текста (изначально берем превью из JSON)
    const [fullContent, setFullContent] = useState(postData?.content || "");

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем общий список постов из public
        fetch('/json/posts.json')
            .then(res => res.json())
            .then(data => {
                const foundPost = data.find(p => p.id === validId);
                if (foundPost) {
                    setPostData(foundPost);
                    // Устанавливаем превью, пока грузится основной файл
                    setFullContent(foundPost.content || "");
                    
                    // Если есть путь к MD, грузим его
                    if (foundPost.mdPath) {
                        return fetch(`/content/${foundPost.mdPath}`);
                    }
                } else {
                    setIsLoading(false);
                }
            })
            .then(res => res ? res.text() : null)
            .then(text => {
                if (text) {
                    // Удаляем YAML метаданные (между ---)
                    const cleanText = text.replace(/^---[\s\S]*?---/, '').trim();
                    setFullContent(cleanText);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Ошибка загрузки:", err);
                setIsLoading(false);
            });
    }, [validId]);

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
    if (!isLoading && !postData) {
        return <Navigate to="/404" />;
    }

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
                        <div className="postDownloadButton">
                            <a href={`/content/${postData.mdPath}`} download={postData.mdPath} ><IoMdDownload /></a>
                        </div>
                    </div>
                    <div className="windowContent" style={{marginBottom: `1em`}}>
                        
                        <div className="bigPostCover"><img src={postData.cover} alt="Обложка поста"/></div>
                        <div className="markdown-body big-post-body" data-theme="dark" style={{marginBottom: `1em`}}>
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
                                        }
                                    }]
                                ]}
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
                            <span>{postData.date}</span>
                        </div>
                    </div>
                    <Badges/>
                </div>
        </Layout>
    </div>
    )
};

export default Post