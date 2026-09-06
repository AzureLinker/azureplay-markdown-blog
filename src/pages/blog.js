import React, { useState, useEffect, useMemo, useCallback } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import PostList from "../components/postlist";
import Badges from "../components/bades";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";
import ProjectFilters from "../components/ProjectFilters"

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
    
    const [postlist, setPostlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const handleFilteredChange = useCallback((newFiltered, currentFilters) => {
        setFilteredPosts(newFiltered);
        setSearchQuery(currentFilters?.search || '');
        setSelectedTags(currentFilters?.tags || []);
        setCurrentPage(1); // сброс страницы
    }, []);

    // Конфигурация фильтров для уровней
    const filterConfig = [
        { key: 'category', type: 'select', label: 'Категория' },
        { key: 'author', type: 'select', label: 'Автор' },
        { key: 'tags', type: 'multi', label: 'Теги' },
    ];

    useEffect(() => {
        setIsLoading(true); // <-- на случай повторного захода

        Promise.all([
            fetch('/json/posts.json').then(res => res.json()),
        ])
            .then(([posts]) => {
                setPostlist(posts);
                setFilteredPosts(posts);
                setIsLoading(false); // <-- готово
            })
            .catch(err => {
                console.error("Ошибка загрузки:", err);
                setIsLoading(false);
            });
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Блог</h1></div>
            <div className="windowGroup-2row">
                <div className="windowBase">
                    <div className="windowName">
                        {isLoading ? (
                            <span>Загрузка...</span>
                        ) : (
                            <>
                        <span>
                            Все посты: Всего {filteredPosts.length}
                        </span>
                        </>
                        )}
                    </div>
                    <div className="windowContent">
                        {isLoading ? (
                            <p>Загрузка постов...</p>
                        ) : (
                            <PostList 
                                postlist={filteredPosts}
                                searchQuery={searchQuery}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                selectedTags={selectedTags}
                            />
                        )}
                    </div>
                </div>
                <div className="windowBase windowBlogTags windowPostChapters">
                    <div className="windowName"><span>Фильтры</span></div>
                    <div className="windowContent">
                        <ProjectFilters
                            projects={postlist}
                            config={filterConfig}
                            onFilteredChange={handleFilteredChange}
                            sortOptions={[
                                { value: 'date', label: 'Дата' },
                                { value: 'title', label: 'Название' },
                            ]}
                        />
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