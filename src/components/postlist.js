import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import { Link } from 'react-router-dom';
import "./components.css"
import "./markdown.css"

function PostList ({ filterTag }) {
    const [postlist, setPostlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    //Настройки пагинации и поиска
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // Сколько постов показывать на одной странице

    useEffect(() => {
        fetch('/json/posts.json') // Путь относительно папки public в билде
            .then(response => response.json())
            .then(data => {
                setPostlist(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Ошибка загрузки постов:", err);
                setIsLoading(false);
            });
    }, []);

    // Сбрасываем страницу на первую, если изменился выбранный тег
    useEffect(() => {
        setCurrentPage(1);
    }, [filterTag]);

    // Улучшенная фильтрация: учитываем и поиск, и выбранный тег
    const filteredPosts = postlist.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Если тег не выбран — подходят все, если выбран — ищем его в массиве post.tags
        const matchesTag = filterTag 
            ? post.tags && post.tags.includes(filterTag) 
            : true;

        return matchesSearch && matchesTag;
    });

    //Логика расчета индексов
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    
    //Получаем только нужную часть постов для текущей страницы
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    //Логика для кнопок (общее кол-во страниц)
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Хендлер для поиска (сбрасывает страницу на 1 при вводе)
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    };

    if (isLoading) return <p>Загрузка постов...</p>;
    return (
        <div className="BlogPostSummary">
            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="blogPagination" style={{marginBottom: `1em`}}>
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Назад</button>
                    <span className="blogPagTotal">Страница {currentPage} из {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Вперед</button>
                </div>
            )}
            {/* Поле поиска */}
            <div className="searchBar">
                <input 
                    type="text" 
                    placeholder="Поиск..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    className="searchInput"
                />
                {searchQuery.length > 0 && (
                    <button onClick={() => setSearchQuery("")} className="resetSearchSelect">Сбросить</button>
                )}
            </div>
            {currentPosts.length > 0 ? (
                currentPosts.map((post) => {
                    //Генерируем превью текста (256 символов)
                    const previewText = post.content.length > 256 
                        ? post.content.substring(0, 256) + "..." 
                        : post.content;

                    return (
                        <div key={post.id} className="postCard"> 
                            <div className="postTitleNMeta">
                                <div className="postName">
                                    <Link className="postName" to={`/post/${post.id}`}>{post.title}</Link>
                                </div>
                                <div className="postMeta">{post.author} - {post.date}</div>
                            </div>
                            <div className="postShortNPicture">
                                <div className="postShort markdown-body" data-theme="dark">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                        {previewText}
                                    </ReactMarkdown>
                                </div>
                                <div className="postPicture">
                                    <img src={post.cover} alt="Обложка поста"/>
                                </div>
                            </div>
                            <div className="postTags">
                                {post.tags && post.tags.map((tag, index) => (
                                    <span key={index} className={tag === filterTag ? "activeTag" : ""}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="readMoreBtn">
                                <Link to={`/post/${post.id}`}>Читать дальше</Link>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>Постов пока нет</p>
            )}

            {/*Блок пагинации*/}
            {totalPages > 1 && (
                <div className="blogPagination">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Назад
                    </button>

                    <span className="blogPagTotal">
                        Страница {currentPage} из {totalPages}
                    </span>

                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    )
}

export default PostList