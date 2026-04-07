import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import "./components.css"
import "./markdown.css"

function BackLogList () {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 10; // Сколько постов показывать на одной странице

    useEffect(() => {
        // 1. Укажи путь к твоему новому JSON файлу в public
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

    // Логика пагинации (без фильтрации)
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(games.length / gamesPerPage);

    if (isLoading) return <p>Загрузка бэклога...</p>;

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
                    <div key={game.id} className="gameCard"> 
                        <div className="gameTitleNMeta">
                            <div className="gameName">
                                {game.title}
                            </div>
                        </div>
                        {/* Статус игры: "В процессе", "Пройдено", "В планах" */}
                            <div className="gameMeta">
                                <p className="gameScore">{game.platform} - {game.status}</p>
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