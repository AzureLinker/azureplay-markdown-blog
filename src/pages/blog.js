import React, { useState, useEffect } from "react";

import Layout from "../components/layout";
import PostList from "../components/postlist";
import Badges from "../components/bades";
import "./pages.css";

function Blog () {
    const [taglist, setTaglist] = useState([]);
     const [selectedTag, setSelectedTag] = useState(null); // Состояние для фильтра

    useEffect(() => {
        // Загружаем теги из public/tags.json
        fetch('/json/tags.json')
            .then(res => res.json())
            .then(data => setTaglist(data))
            .catch(err => console.error("Ошибка загрузки тегов:", err));
    }, []);
    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Блог</h1></div>
            <div className="windowGroup-2row">
                <div className="windowBase">
                    <div className="windowName tagSearchWindow">
                        <span>{selectedTag ? `Посты по тегу: ${selectedTag}` : "Все посты"}</span>
                        {selectedTag && (
                            <button onClick={() => setSelectedTag(null)} className="resetTagSelect">Сбросить</button>
                        )}
                    </div>
                    <div className="windowContent"><PostList filterTag={selectedTag}/></div>
                </div>
                <div className="windowBase windowBlogTags">
                    <div className="windowName"><span>Теги</span></div>
                    <div className="windowContent postListTags">
                        {taglist && taglist.length > 0 ? (
                            taglist.map((tag, index) => (
                                // tag — это уже строка, поэтому выводим её напрямую
                                <span 
                                key={index} 
                                className={`postTag ${selectedTag === tag ? 'active' : ''}`}
                                onClick={() => setSelectedTag(tag)} // Установка фильтра
                                style={{cursor: 'pointer'}}
                            >
                                {tag}
                            </span>
                            ))
                        ) : (
                            <span>Тегов пока нет</span>
                        )}
                    </div>
                </div>
            </div>
            <Badges/>
        </Layout>
    </div>
    )
};

export default Blog