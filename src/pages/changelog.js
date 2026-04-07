import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'

import Layout from "../components/layout";
import Badges from "../components/bades";
import "./pages.css";

function Changelog () {
    const [content, setContent] = useState("");
    useEffect(() => {
        fetch(`/pageContent/changelog.md`)
            .then((response) => response.text())
            .then((text) => setContent(text))
            .catch((err) => console.error("Ошибка загрузки md:", err));
    }, []); // Пустой массив значит "выполнить один раз"
    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Список изменений</h1></div>
            <div className="markdown-body" data-theme="dark" style={{ marginBottom: `1em`, borderRadius: `1em`}}><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown></div>
            <Badges/>
        </Layout>
    </div>
    )
};

export default Changelog