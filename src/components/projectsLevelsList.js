import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import { Link } from 'react-router-dom';
import "./components.css"
import "./markdown.css"

function ProjectsLevelsList({levels}) {
    const [currentPage, setCurrentPage] = useState(1);
    const levelsPerPage = 10; // Сколько постов показывать на одной странице

    // Логика пагинации (без фильтрации)
    const indexOfLastGame = currentPage * levelsPerPage;
    const indexOfFirstGame = indexOfLastGame - levelsPerPage;
    const currentLevels = levels.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(levels.length / levelsPerPage);


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
            
            {currentLevels.length > 0 ? (
                currentLevels.map((level) => (
                    // Карточка игры
                    <div key={level.id} className="projectCard"> 
                        <div className="projectNameNMeta">
                            <div className="projectName">
                                {level.mdPath ? (
                                    // Если путь к MD есть — рендерим ссылку
                                    <Link className="" to={`/projects/levels/${level.id}`}>{level.title}</Link>
                                ) : (
                                    // Если пути нет — просто текст
                                    <span>{level.title}</span>
                                )}
                            </div>
                        </div>
                        {/* Статус игры: "В процессе", "Пройдено", "В планах" */}
                            <div className="projectMeta">
                                <p className="projectMetadata">{level.game_for} - {level.status}</p>
                                <p className="projectMetadata">Версия: {level.version || "Версия не указана"}</p>
                            </div>
                            <div className="projectMeta">
                                <p className="projectMetadata">Начало разработки: {new Date(level.date_added).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="projectMetadata">Последнее обновление: {new Date(level.date_last_update).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {level.comment || "Без комментариев"}
                                </ReactMarkdown>
                            </div>
                            <div className="projectPicture">
                                    <img src={level.cover} alt={level.title} loading="lazy"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            {level.links && level.links.map((link) => (
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
                            {level.authors && level.authors.map((a, index) => (
                                <span key={index}>{a}</span>
                            ))}
                        </div>
                    </div>
                    
                ))
            ) : (
                <p>Список уровней пуст</p>
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

export default ProjectsLevelsList