import React, { useState, useEffect, useCallback } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ProjectsLevelsList from "../components/projectsLevelsList";
import ProjectFilters from "../components/ProjectFilters";
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
    const [filteredLevels, setFilteredLevels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const handleFilteredChange = useCallback((newFiltered, currentFilters) => {
        setFilteredLevels(newFiltered);
        setSearchQuery(currentFilters?.search || '');
        setSelectedTags(currentFilters?.tags || []);
        setSelectedAuthors(currentFilters?.authors || []);
        setCurrentPage(1); // сброс страницы
    }, []);

        // Конфигурация фильтров для уровней
    const filterConfig = [
        { key: 'game_for', type: 'select', label: 'Игра' },
        { key: 'status', type: 'select', label: 'Статус' },
        { key: 'authors', type: 'multi', label: 'Авторы' },
        { key: 'tags', type: 'multi', label: 'Теги' },
        { key: 'links', type: 'checkbox', label: 'Есть ссылки' },
        { key: 'mdPath', type: 'checkbox', label: 'Есть статья' },
    ];

    useEffect(() => {
        // Загружаем все JSON параллельно
        Promise.all([
            fetch('/json/projectsLevels.json').then(r => r.json())
        ])
        .then(([levelsData]) => {
            setLevels(levelsData);
            setFilteredLevels(levelsData);
            setIsLoading(false);
        })
        .catch(err => console.error("Ошибка загрузки уровней:", err));
        setIsLoading(false);
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты: Уровни</h1></div>
            <div className="windowGroup-2row">
                <div className="windowBase">
                    <div className="windowName"><span>Уровни: Всего {filteredLevels.length}</span></div>
                    <div className="windowContent">
                        {isLoading ? (
                            <p>Загрузка...</p>
                            ) : (
                                <ProjectsLevelsList 
                                    levels={filteredLevels} 
                                    searchQuery={searchQuery}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    selectedTags={selectedTags}
                                    selectedAuthors={selectedAuthors}
                                />
                        )}
                    </div>
                </div>
                <div className="windowBase windowBlogTags windowPostChapters">
                    <div className="windowName"><span>Фильтры</span></div>
                    <div className="windowContent">
                        <ProjectFilters
                            projects={levels}
                            config={filterConfig}
                            onFilteredChange={handleFilteredChange}
                            sortOptions={[
                                { value: 'date_added', label: 'Дата добавления' },
                                { value: 'date_last_update', label: 'Дата обновления' },
                                { value: 'title', label: 'Название' },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <Badges/>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default ProjectsLevels