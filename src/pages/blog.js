import React, { useState, useEffect, useMemo } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import PostList from "../components/postlist";
import Badges from "../components/bades";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function Blog () {
    usePageMeta({
        title: 'Блог AzurePlay | Markdown Blog',
        description: 'Все посты блога AzurePlay.',
        keywords: ['блог', 'игры', 'прохождения', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Блог AzurePlay',
        description: 'Все посты блога AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/blog',
        type: 'website',
    });
    
    const [taglist, setTaglist] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null); // Состояние для фильтра
    const [postlist, setPostlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tagsPerPage = 50; // Сколько тегов показывать на одной странице
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true); // <-- на случай повторного захода

        Promise.all([
            fetch('/json/tags.json').then(res => res.json()),
            fetch('/json/posts.json').then(res => res.json()),
        ])
            .then(([tags, posts]) => {
                setTaglist(tags);
                setPostlist(posts);
                setIsLoading(false); // <-- готово
            })
            .catch(err => {
                console.error("Ошибка загрузки:", err);
                setIsLoading(false);
            });
    }, []);

    const tagCounts = useMemo(() => {
        const counts = {};
        postlist.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    counts[tag] = (counts[tag] || 0) + 1;
                });
            }
        });
        return counts;
    }, [postlist]);

    const indexOfLastPost = currentPage * tagsPerPage;
    const indexOfFirstPost = indexOfLastPost - tagsPerPage;
    const currentTags = taglist.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(taglist.length / tagsPerPage);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Блог</h1></div>
            <div className="windowGroup-2row">
                <div className="windowBase">
                    <div className="windowName tagSearchWindow">
                        {isLoading ? (
                            <span>Загрузка...</span>
                        ) : (
                            <>
                        <span>{selectedTag ? `Посты по тегу: ${selectedTag} (${tagCounts[selectedTag] || 0})` : `Все посты: Всего ${postlist.length}`}</span>
                        {selectedTag && (
                            <button onClick={() => setSelectedTag(null)} className="resetTagSelect">Сбросить</button>
                        )}
                        </>
                        )}
                    </div>
                    <div className="windowContent">{isLoading ? (
                            <p>Загрузка постов...</p>
                        ) : (
                            <PostList filterTag={selectedTag} postlist={postlist} />
                        )}</div>
                </div>
                <div className="windowBase windowBlogTags">
                    <div className="windowName"><span>Теги: Всего {isLoading ? '...' : taglist.length}</span></div>
                    <div className="windowContent postListTags">
                        {/* Пагинация */}
                        {totalPages > 1 && (
                            <div className="blogPagination" style={{marginBottom: `1em`}}>
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Назад</button>
                                <span className="blogPagTotal" style={{background: `none`, boxShadow: `none`}}>Страница {currentPage} из {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Вперед</button>
                            </div>
                        )}
                        {isLoading ? (
                            <span>Загрузка тегов...</span>
                        ) : currentTags && currentTags.length > 0 ? (
                            currentTags.map((tag, index) => (
                                <span 
                                    key={index} 
                                    className={`postTag ${selectedTag === tag ? 'active' : ''}`}
                                    onClick={() => setSelectedTag(tag)}
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
        <ScrollToTop smooth />
    </div>
    )
};

export default Blog