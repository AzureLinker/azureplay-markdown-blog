import React, { useState, useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ProjectsGamesList from "../components/projectsGamesList";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function ProjectsGames () {
    usePageMeta({
        title: 'Игры AzurePlay | Markdown Blog',
        description: 'Список игр, разработанных AzurePlay полностью, или при поддержке AzurePlay.',
        keywords: ['проекты', 'игры', 'разработка', 'геймдев', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Игры AzurePlay',
        description: 'Список игр AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/projects/games',
        type: 'website',
    });
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем все JSON параллельно
        Promise.all([
            fetch('/json/projectsGames.json').then(r => r.json())
        ])
        .then(([gamesData]) => {
            setGames(gamesData);
            setIsLoading(false);
        })
        .catch(err => console.error("Ошибка загрузки игр:", err));
        setIsLoading(false);
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты: Игры</h1></div>
            <div className="windowBase">
                <div className="windowName"><span>Игры: Всего {games.length}</span></div>
                <div className="windowContent">
                    {isLoading ? (
                        <p>Загрузка...</p>
                        ) : (
                            <ProjectsGamesList games={games}/>
                    )}
                </div>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default ProjectsGames