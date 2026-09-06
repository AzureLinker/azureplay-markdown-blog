import React, { useState, useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import Layout from "../components/layout";
import Badges from "../components/bades";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function Home () {
    usePageMeta({
        title: 'AzurePlay | Markdown Blog',
        description: 'Официальный markdown блог AzurePlay. Читайте посты о разных играх и технологиях.',
        keywords: ['блог', 'игры', 'технологии', 'прохождения', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Сайт AzurePlay',
        description: 'Главная страница сайта AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/',
        type: 'website',
    });
    const [content, setContent] = useState("");
        useEffect(() => {
            fetch(`/pageContent/home.md`)
                .then((response) => response.text())
                .then((text) => setContent(text))
                .catch((err) => console.error("Ошибка загрузки md:", err));
        }, []); // Пустой массив значит "выполнить один раз"
    return ( 
    <div>
        <Layout>
            <div className="siteCap"></div>
            <h1>Главная</h1>
            <div className="windowGroup-2row">
                <div className="windowBase">
                    <div className="windowName"><span>О сайте</span></div>
                    <div className="windowContent markdown-body" data-theme="dark"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown></div>
                </div>
                <div className="windowBase windowBlogTags">
                    <div className="windowName"><span>Профиль</span></div>
                    <div className="windowContent">
                        <div className="homeProfile">
                            <div className="homeInfo">
                                <p>Zian U</p>
                                <p>2003-01-13</p>
                                <p>Она\её</p>
                                <p><a href="mailto:azureplay.work@gmail.com">Рабочая почта</a></p>
                                <p><a href="https://neocities.org/site/zianu-azureplay" target="_blank" rel="noopener noreferrer">Follow Me</a></p>
                            </div>
                            <div className="homeAvatar">
                                <img src="/avatar512.png" loading="lazy" alt="avatar"/>
                            </div>
                        </div>
                        <div className="profileBadges">
                            <img src="/barsNBadges/girlbutton.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/firefox2.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/quake2now.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/transnow2.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/psbutton.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/konata.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/half-life.gif" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/k12.png" loading="lazy" alt="web-badge"/>
                            <img src="/barsNBadges/b8.gif" loading="lazy" alt="web-badge"/>
                        </div>
                        <div className="profileBars">
                            <a href="https://mynickname.com/zianu" target="_blank" rel="noopener noreferrer"><img src="https://mynickname.com/img.php?nick=Zian+U&sert=2" loading="lazy" alt="Никнейм Zian U зарегистрирован!" border="0" /></a>
                            <img src="/barsNBadges/5e4c06fad486962e1caff8c0547ec03d.gif" loading="lazy" alt="userbar" />
                            <img src="/barsNBadges/d3bfd922f5de73048ed4f493d42db63e.png" loading="lazy" alt="userbar" />
                            <img src="/barsNBadges/05ead48c4bb2b0e941f4d5c1d1b39cd1.gif" loading="lazy" alt="userbar" />
                            <img src="/barsNBadges/40c0440b8c91b555b1681e7e620ac10f.gif" loading="lazy" alt="userbar" />
                            <img src="/barsNBadges/d8f79d9d0df3cad5bd686638b6dba1eb.gif" loading="lazy" alt="userbar" />
                        </div>
                    </div>
                </div>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

// style={{width: `100%`}}

export default Home