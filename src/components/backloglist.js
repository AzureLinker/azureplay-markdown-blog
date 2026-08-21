import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import "./components.css"
import "./markdown.css"

function BackLogList () {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState(null);

    const STATUS_ORDER = [
    "Не указано",
    "Заброшено",
    "Хочу пройти",
    "Прохожу",
    "Пройдено",
    "Пройдено несколько раз",
    "Перепрохожу"
    ];

    const stats = useMemo(() => {
    if (games.length === 0) return null;

    const counts = games.reduce((acc, game) => {
        const status = game.status || "Не указано";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // Превращаем в массив для удобного рендера полосок
    return STATUS_ORDER
        .filter(status => counts[status]) // Берем только те статусы, которые есть в данных
        .map(status => ({
            status,
            count: counts[status],
            percent: (counts[status] / games.length) * 100
        }));
    }, [games]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 10; // Сколько игр показывать на одной странице

    useEffect(() => {
        fetch('/json/games.json') 
            .then(response => response.json())
            .then(data => {
                setGames(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Ошибка загрузки списка игр:", err);
                setIsLoading(false);
            });
    }, []);

    const filteredGames = useMemo(() => {
        if (!filterStatus) return games;
        return games.filter(game => game.status === filterStatus);
    }, [games, filterStatus]);

    // Логика пагинации теперь использует filteredGames
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

    const toggleFilter = (status) => {
        setFilterStatus(prev => prev === status ? null : status);
        setCurrentPage(1); // Сбрасываем страницу на первую при смене фильтра
    };

    if (isLoading) return <p>Загрузка бэклога...</p>;

    return (
            <div className="BlogPostSummary">
            {stats && (
                <div className="backlog-progress-container">
                    <h3 className="stats-title">Статистика бэклога. Всего игр: {games.length}</h3>
    
                    {/* Общая полоса */}
                    <div className="progress-stack-bar">
                        {stats.map((item, index) => (
                        <div 
                            key={index}
                            className={`bar-segment segment-${item.status.replace(/\s+/g, '-').toLowerCase()} ${filterStatus === item.status ? 'active-segment' : ''}`}
                            onClick={() => toggleFilter(item.status)}
                            style={{ width: `${item.percent}%`, cursor: 'pointer' }}
                            title={`${item.status}: ${item.count}`}
                        />
                        ))}
                    </div>
                    {/* Легенда (текстовые подписи) */}
                    <div className="progress-legend">
                        {stats.map((item, index) => (
                            <div 
                                key={index} 
                                className={`legend-item ${filterStatus === item.status ? 'active-legend' : ''}`}
                                onClick={() => toggleFilter(item.status)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className={`legend-dot dot-${item.status.replace(/\s+/g, '-').toLowerCase()}`}></span>
                                <span className="legend-text">{item.status}: <strong>{item.count}</strong></span>
                            </div>
                        ))}
                    </div>
                    {filterStatus && (
                        <div className={`backlogFilter-btn`}>
                            <p>Поиск игр по статусу: <strong>{filterStatus}</strong> </p>
                            <button onClick={() => setFilterStatus(null)}>Сбросить</button>
                        </div>
                    )}
                </div>
            )}
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
                    <div key={game.id} className="gameCard"> 
                        <div className="gameTitleNMeta">
                            <div className="gameName">
                                {game.title}
                                <p className="gameScore">Дата выхода: {new Date(game.date_added).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        {/* Статус игры: "В процессе", "Пройдено", "В планах" */}
                            <div className="gameMeta">
                                <p className="gameScore">{game.platform} - {game.status || "Статус не указан"}</p>
                                <p className="gameScore">Оценка: {game.score || "Рейтинга ещё нет"}</p>
                            </div>
                        <div className="gameComment">
                            <div className="gameShort markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                    {game.comment || "Без комментариев"}
                                </ReactMarkdown>
                            </div>
                            <div className="gamePicture">
                                    <img src={game.cover} alt={game.title}/>
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
                        <div className="gameAuthors">
                            <p>Авторы: </p>
                            {game.authors && game.authors.map((a, index) => (
                                <span key={index}>{a}</span>
                            ))}
                        </div>

                        <div className="gameGenres">
                            {game.genre && game.genre.map((g, index) => (
                                <span key={index}>{g}</span>
                            ))}
                        </div>
                    </div>
                    
                ))
            ) : (
                <p>Бэклог пуст</p>
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

export default BackLogList