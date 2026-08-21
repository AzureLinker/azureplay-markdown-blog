import React, { useState, useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ProjectsLevelsList from "../components/projectsLevelsList";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function ProjectsLevels () {
    usePageMeta({
        title: 'Уровни от AzurePlay | Markdown Blog',
        description: 'Список уровней для разных игр, разработанных AzurePlay полностью, или при поддержке AzurePlay.',
        keywords: ['проекты', 'игры', 'разработка', 'уровни', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Уровни от AzurePlay',
        description: 'Список уровней для разных игр от AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/projects/levels',
        type: 'website',
    });
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем все JSON параллельно
        Promise.all([
            fetch('/json/projectsLevels.json').then(r => r.json())
        ])
        .then(([levelsData]) => {
            setLevels(levelsData);
            setIsLoading(false);
        })
        .catch(err => console.error("Ошибка загрузки уровней:", err));
        setIsLoading(false);
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты: Уровни</h1></div>
            <div className="windowBase">
                <div className="windowName"><span>Уровни: Всего {levels.length}</span></div>
                <div className="windowContent">
                    {isLoading ? (
                        <p>Загрузка...</p>
                        ) : (
                            <ProjectsLevelsList levels={levels}/>
                    )}
                </div>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default ProjectsLevels