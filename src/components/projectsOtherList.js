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

function ProjectsOtherList({projects, searchQuery, currentPage, setCurrentPage, selectedTags, selectedAuthors}) {
    const projectsPerPage = 10; // Сколько постов показывать на одной странице

    // Логика пагинации (без фильтрации)
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    // Сбрасываем страницу при изменении данных
    useEffect(() => {
        setCurrentPage(1);
    }, [projects, searchQuery]);

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
            
            {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                    // Карточка игры
                    <div key={project.id} className="projectCard"> 
                        <div className="projectNameNMeta">
                            <div className="projectName">
                                {project.mdPath ? (
                                    // Если путь к MD есть — рендерим ссылку
                                    <Link className="" to={`/projects/other/${project.id}`}>{highlightText(project.title, searchQuery)}</Link>
                                ) : (
                                    // Если пути нет — просто текст
                                    <span>{highlightText(project.title, searchQuery)}</span>
                                )}                                
                            </div>
                        </div>
                        {/* Статус игры: "В процессе", "Пройдено", "В планах" */}
                            <div className="projectMeta">
                                <p className="projectMetadata">{project.type} - {project.status}</p>
                                <p className="projectMetadata">Версия: {project.version || "Версия не указана"}</p>
                            </div>
                            <div className="projectMeta">
                                <p className="projectMetadata">Начало разработки: {new Date(project.date_added).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="projectMetadata">Последнее обновление: {new Date(project.date_last_update).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {project.comment || "Без комментариев"}
                                </ReactMarkdown>
                            </div>
                            <div className="projectPicture">
                                    <img src={project.cover} alt={project.title} loading="lazy"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            {project.links && project.links.map((link) => (
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
                            {project.authors && project.authors.map((a, index) => (
                                <span key={index} className={selectedAuthors?.includes(a) ? 'activeTag' : ''}>{a}</span>
                            ))}
                        </div>
                        <div className="projectTags">
                            {project.tags && project.tags.map((tag, index) => (
                                <span key={index} className={selectedTags?.includes(tag) ? 'activeTag' : ''}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                ))
            ) : (
                <p>Список проектов пуст</p>
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

export default ProjectsOtherList