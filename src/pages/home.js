import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import Layout from "../components/layout";
import Badges from "../components/bades";
import "./pages.css";

function Home () {
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
                                <p><a href="https://neocities.org/site/zianu-azureplay">Follow Me</a></p>
                            </div>
                            <div className="homeAvatar">
                                <img src="/avatar512.png" alt="avatar"/>
                            </div>
                        </div>
                        <div className="profileBadges">
                            <img src="/barsNBadges/girlbutton.gif" alt="web-badge"/>
                            <img src="/barsNBadges/firefox2.gif" alt="web-badge"/>
                            <img src="/barsNBadges/quake2now.gif" alt="web-badge"/>
                            <img src="/barsNBadges/transnow2.gif" alt="web-badge"/>
                            <img src="/barsNBadges/psbutton.gif" alt="web-badge"/>
                            <img src="/barsNBadges/konata.gif" alt="web-badge"/>
                            <img src="/barsNBadges/half-life.gif" alt="web-badge"/>
                            <img src="/barsNBadges/k12.png" alt="web-badge"/>
                            <img src="/barsNBadges/b8.gif" alt="web-badge"/>
                        </div>
                        <div className="profileBars">
                            <img src="/barsNBadges/5e4c06fad486962e1caff8c0547ec03d.gif" alt="userbar" />
                            <img src="/barsNBadges/d3bfd922f5de73048ed4f493d42db63e.png" alt="userbar" />
                            <img src="/barsNBadges/05ead48c4bb2b0e941f4d5c1d1b39cd1.gif" alt="userbar" />
                            <img src="/barsNBadges/40c0440b8c91b555b1681e7e620ac10f.gif" alt="userbar" />
                            <img src="/barsNBadges/d8f79d9d0df3cad5bd686638b6dba1eb.gif" alt="userbar" />
                        </div>
                    </div>
                </div>
            </div>
            <Badges/>
        </Layout>
    </div>
    )
};

// style={{width: `100%`}}

export default Home