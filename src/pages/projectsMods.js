import React, { useState, useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ProjectsModsList from "../components/projectsModsList";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function ProjectsMods () {
    usePageMeta({
        title: 'Моды от AzurePlay | Markdown Blog',
        description: 'Список модов для разных игр, разработанных AzurePlay полностью, или при поддержке AzurePlay.',
        keywords: ['проекты', 'игры', 'разработка', 'модификации', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Моды от AzurePlay',
        description: 'Список модов для разных игр от AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/projects/mods',
        type: 'website',
    });
    const [mods, setMods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Загружаем все JSON параллельно
        Promise.all([
            fetch('/json/projectsMods.json').then(r => r.json())
        ])
        .then(([modsData]) => {
            setMods(modsData);
            setIsLoading(false);
        })
        .catch(err => console.error("Ошибка загрузки модов:", err));
        setIsLoading(false);
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты: Моды</h1></div>
            <div className="windowBase">
                <div className="windowName"><span>Моды: Всего {mods.length}</span></div>
                <div className="windowContent">
                    {isLoading ? (
                        <p>Загрузка...</p>
                        ) : (
                            <ProjectsModsList mods={mods}/>
                    )}
                </div>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default ProjectsMods