import React, { useState, useEffect } from "react";
import {useLocation  } from 'react-router-dom';
import ScrollToTop from "react-scroll-to-top";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite from 'rehype-rewrite';
import CalloutBlock from '../components/CalloutBlock';
import Layout from "../components/layout";
import Badges from "../components/bades";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function Changelog () {
    usePageMeta({
        title: 'Список обновлений сайта AzurePlay | Markdown Blog',
        description: 'Это полный список всех обновлений сайта AuzrePlay.',
        keywords: ['обновления', 'сайт', 'разработка', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Список обновлений сайта AzurePlay',
        description: 'Это полный список всех обновлений сайта AuzrePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/changelog',
        type: 'website',
    });
    const [content, setContent] = useState("");
    const location = useLocation();
    useEffect(() => {
        fetch(`/pageContent/changelog.md`)
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
            <div className="pageName"><h1>Список изменений</h1></div>
            <div className="markdown-body" data-theme="dark" style={{ marginBottom: `1em`, borderRadius: `1em`}}>
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
                                                {content}
                                            </ReactMarkdown>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default Changelog