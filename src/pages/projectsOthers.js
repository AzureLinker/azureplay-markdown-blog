import React, { useState, useEffect, useCallback } from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import ProjectsOtherList from "../components/projectsOtherList";
import ProjectFilters from "../components/ProjectFilters"
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
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const handleFilteredChange = useCallback((newFiltered, currentFilters) => {
        setFilteredProjects(newFiltered);
        setSearchQuery(currentFilters?.search || '');
        setSelectedTags(currentFilters?.tags || []);
        setSelectedAuthors(currentFilters?.authors || []);
        setCurrentPage(1); // сброс страницы
    }, []);

    // Конфигурация фильтров для уровней
    const filterConfig = [
        { key: 'type', type: 'select', label: 'Тип проекта' },
        { key: 'status', type: 'select', label: 'Статус' },
        { key: 'authors', type: 'multi', label: 'Авторы' },
        { key: 'tags', type: 'multi', label: 'Теги' },
        { key: 'links', type: 'checkbox', label: 'Есть ссылки' },
        { key: 'mdPath', type: 'checkbox', label: 'Есть статья' },
    ];

    useEffect(() => {
        // Загружаем все JSON параллельно
        Promise.all([
            fetch('/json/projectsOther.json').then(r => r.json())
        ])
        .then(([projectsData]) => {
            setProjects(projectsData);
            setFilteredProjects(projectsData);
            setIsLoading(false);
        })
        .catch(err => console.error("Ошибка загрузки проектов:", err));
        setIsLoading(false);
    }, []);

    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты: Другие</h1></div>
            <div className="windowGroup-2row">
                <div className="windowBase">
                    <div className="windowName"><span>Прочие: Всего {filteredProjects.length}</span></div>
                    <div className="windowContent">
                        {isLoading ? (
                            <p>Загрузка...</p>
                            ) : (
                                <ProjectsOtherList 
                                    projects={filteredProjects}
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
                            projects={projects}
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

export default ProjectsOthers