import React, { useState, useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ProjectsOtherList from "../components/projectsOtherList";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function ProjectsOthers () {
    usePageMeta({
        title: 'Другие проекты от AzurePlay | Markdown Blog',
        description: 'Список различных проектов, разработанных AzurePlay полностью, или при поддержке AzurePlay.',
        keywords: ['проекты', 'игры', 'разработка', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Другие проекты AzurePlay',
        description: 'Список различных проектов от AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/projects/other',
        type: 'website',
    });
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем все JSON параллельно
        Promise.all([
            fetch('/json/projectsOther.json').then(r => r.json())
        ])
        .then(([projectsData]) => {
            setProjects(projectsData);
            setIsLoading(false);
        })
        .catch(err => console.error("Ошибка загрузки проектов:", err));
        setIsLoading(false);
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты: Другие</h1></div>
            <div className="windowBase">
                <div className="windowName"><span>Прочие: Всего {projects.length}</span></div>
                <div className="windowContent">
                    {isLoading ? (
                        <p>Загрузка...</p>
                        ) : (
                            <ProjectsOtherList projects={projects}/>
                    )}
                </div>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default ProjectsOthers