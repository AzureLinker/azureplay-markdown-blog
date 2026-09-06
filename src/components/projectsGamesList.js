import React, { useState, useEffect  } from "react";
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

function ProjectsGamesList({games, searchQuery, currentPage, setCurrentPage, selectedTags, selectedAuthors}) {
    const gamesPerPage = 10; // Сколько постов показывать на одной странице

    // Логика пагинации (без фильтрации)
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(games.length / gamesPerPage);

    // Сбрасываем страницу при изменении данных
    useEffect(() => {
        setCurrentPage(1);
    }, [games, searchQuery]);

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
            
            {currentGames.length > 0 ? (
                currentGames.map((game) => (
                    // Карточка игры
                    <div key={game.id} className="projectCard"> 
                        <div className="projectNameNMeta">
                            <div className="projectName">
                                {game.mdPath ? (
                                    // Если путь к MD есть — рендерим ссылку
                                    <Link className="" to={`/projects/games/${game.id}`}>{highlightText(game.title, searchQuery)}</Link>
                                ) : (
                                    // Если пути нет — просто текст
                                    <span>{highlightText(game.title, searchQuery)}</span>
                                )}                                
                            </div>
                        </div>
                            <div className="projectMeta">
                                <p className="projectMetadata">{game.platform} - {game.status}</p>
                                <p className="projectMetadata">Версия: {game.version || "Версия не указана"}</p>
                            </div>
                            <div className="projectMeta">
                                <p className="projectMetadata">Начало разработки: {new Date(game.date_added).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="projectMetadata">Последнее обновление: {new Date(game.date_last_update).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {game.comment || "Без комментариев"}
                                </ReactMarkdown>
                            </div>
                            <div className="projectPicture">
                                    <img src={game.cover} alt={game.title} loading="lazy"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            {game.links && game.links.map((link) => (
                                <a 
                                    key={link.link_id} 
                                    href={link.link_path} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="projectLinkBtn"
                                >
                                    {link.link_title}
                                </a>
                            ))}
                        </div>
                        <div className="projectAuthors">
                            <p>Авторы: </p>
                            {game.authors && game.authors.map((a, index) => (
                                <span key={index} className={selectedAuthors?.includes(a) ? 'activeTag' : ''}>{a}</span>
                            ))}
                        </div>
                        <div className="projectTags">
                            {game.tags && game.tags.map((tag, index) => (
                                <span key={index} className={selectedTags?.includes(tag) ? 'activeTag' : ''}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                ))
            ) : (
                <p>Список игр пуст</p>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="blogPagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Назад</button>
                    <span className="blogPagTotal">Страница {currentPage} из {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Вперед</button>
                </div>
            )}
            </div>
    )
}

export default ProjectsGamesList