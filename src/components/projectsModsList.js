import React, { useState, useEffect } from "react";
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

function ProjectsModsList({mods, searchQuery, currentPage, setCurrentPage, selectedTags, selectedAuthors}) {
    const modsPerPage = 10; // Сколько постов показывать на одной странице

    // Логика пагинации (без фильтрации)
    const indexOfLastGame = currentPage * modsPerPage;
    const indexOfFirstGame = indexOfLastGame - modsPerPage;
    const currentMods = mods.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(mods.length / modsPerPage);

    // Сбрасываем страницу при изменении данных
    useEffect(() => {
        setCurrentPage(1);
    }, [mods, searchQuery]);

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
            
            {currentMods.length > 0 ? (
                currentMods.map((mod) => (
                    // Карточка игры
                    <div key={mod.id} className="projectCard"> 
                        <div className="projectNameNMeta">
                            <div className="projectName">
                                {mod.mdPath ? (
                                    // Если путь к MD есть — рендерим ссылку
                                    <Link className="" to={`/projects/mods/${mod.id}`}>{highlightText(mod.title, searchQuery)}</Link>
                                ) : (
                                    // Если пути нет — просто текст (можно добавить класс для стилизации)
                                    <span>{highlightText(mod.title, searchQuery)}</span>
                                )}
                            </div>
                        </div>
                        {/* Статус игры: "В процессе", "Пройдено", "В планах" */}
                            <div className="projectMeta">
                                <p className="projectMetadata">{mod.game_for} - {mod.status}</p>
                                <p className="projectMetadata">Версия: {mod.version || "Версия не указана"}</p>
                            </div>
                            <div className="projectMeta">
                                <p className="projectMetadata">Начало разработки: {new Date(mod.date_added).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="projectMetadata">Последнее обновление: {new Date(mod.date_last_update).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {mod.comment || "Без комментариев"}
                                </ReactMarkdown>
                            </div>
                            <div className="projectPicture">
                                    <img src={mod.cover} alt={mod.title} loading="lazy"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            {mod.links && mod.links.map((link) => (
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
                            {mod.authors && mod.authors.map((a, index) => (
                                <span key={index} className={selectedAuthors?.includes(a) ? 'activeTag' : ''}>{a}</span>
                            ))}
                        </div>
                        <div className="projectTags">
                            {mod.tags && mod.tags.map((tag, index) => (
                                <span key={index} className={selectedTags?.includes(tag) ? 'activeTag' : ''}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                ))
            ) : (
                <p>Список модов пуст</p>
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

export default ProjectsModsList