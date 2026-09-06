import React, { useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import { Link } from 'react-router-dom';
import "./components.css"
import "./markdown.css"

function highlightText(text, query) {
    if (!query || query.trim() === '') return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    return (
        <>
            {text.substring(0, index)}
            <mark className="highlighted">{text.substring(index, index + query.length)}</mark>
            {text.substring(index + query.length)}
        </>
    );
}

function PostList ({ postlist, searchQuery, currentPage, setCurrentPage, selectedTags }) {
    const postsPerPage = 10; // Сколько постов показывать на одной странице

    // Сбрасываем страницу при изменении данных
    useEffect(() => {
        setCurrentPage(1);
    }, [postlist, searchQuery]);

    //Логика расчета индексов
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    
    //Получаем только нужную часть постов для текущей страницы
    const currentPosts = postlist.slice(indexOfFirstPost, indexOfLastPost);

    //Логика для кнопок (общее кол-во страниц)
    const totalPages = Math.ceil(postlist.length / postsPerPage);

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
            {currentPosts.length > 0 ? (
                currentPosts.map((post) => {
                    //Генерируем превью текста (256 символов)
                    const previewText = post.content.length > 256 
                        ? post.content.substring(0, 256) + "..." 
                        : post.content;

                    return (
                        <div key={post.id} className="postCard"> 
                            <div className="postTitle">
                                <div className="postName">
                                    <Link className="postName" to={`/post/${post.id}`}>{highlightText(post.title, searchQuery)}</Link>
                                </div>
                            </div>
                            <div className="postMeta">
                                <p className="postMetadata">{post.author}</p>
                                <p className="postMetadata">{new Date(post.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="postShortNPicture">
                                <div className="postShort markdown-body" data-theme="dark">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                        {previewText}
                                    </ReactMarkdown>
                                </div>
                                <div className="postPicture">
                                    <img src={post.cover} alt="Обложка поста" loading="lazy"/>
                                </div>
                            </div>
                            <div className="postCategory">Категория: {post.category || "Не указана"}</div>
                            <div className="postTags">
                                {post.tags && post.tags.map((tag, index) => (
                                    <span key={index} className={selectedTags?.includes(tag) ? 'activeTag' : ''}>
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