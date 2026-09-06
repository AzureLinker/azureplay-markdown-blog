import React, { useState } from 'react';

/**
 * Универсальные фильтры и сортировка для проектов.
 * 
 * Пропсы:
 * - projects: массив объектов
 * - config: массив настроек фильтров
 * - onFilteredChange: колбэк с результатом и текущими фильтрами
 * - sortOptions: массив { value, label } для сортировки (например, [{ value: 'date_added', label: 'Дата добавления' }])
 */
export default function ProjectFilters({ projects, config, onFilteredChange, sortOptions }) {
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(sortOptions?.[0]?.value || '');
    const [sortDirection, setSortDirection] = useState('desc');
    const [showClear, setShowClear] = useState(false);
    const [isSortChanged, setIsSortChanged] = useState(false);

    const hasActiveFilters = (currentFilters) => {
        return Object.entries(currentFilters).some(([key, value]) => {
            if (value === '' || value === null || value === undefined) return false;
            if (value === 'all') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            if (value === false) return false;
            return true;
        });
    };

    const applyAndSend = (currentFilters, currentSortBy, currentDirection) => {
        let result = [...projects];

        // Поиск по названию
        const searchQuery = currentFilters.search;
        if (searchQuery && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(query) ||
                p.name?.toLowerCase().includes(query)
            );
        }

        // Остальные фильтры
        config.forEach(cfg => {
            const value = currentFilters[cfg.key];
            if (value === undefined || value === null || value === '' || value === 'all') return;

            switch (cfg.type) {
                case 'select':
                    result = result.filter(p => p[cfg.key] === value);
                    break;
                case 'checkbox':
                    if (value === true) {
                        result = result.filter(p => {
                            const field = p[cfg.key];
                            if (Array.isArray(field)) return field.length > 0;
                            if (typeof field === 'string') return field.trim() !== '';
                            return Boolean(field);
                        });
                    }
                    break;
                case 'multi':
                    if (Array.isArray(value) && value.length > 0) {
                        result = result.filter(p => {
                            const field = p[cfg.key];
                            if (Array.isArray(field)) {
                                return value.some(v => field.includes(v));
                            }
                            return value.includes(field);
                        });
                    }
                    break;
                default:
                    break;
            }
        });

        // Сортировка
        if (currentSortBy) {
            result.sort((a, b) => {
                const aVal = a[currentSortBy];
                const bVal = b[currentSortBy];
                if (aVal === undefined || aVal === null) return 1;
                if (bVal === undefined || bVal === null) return -1;
                if (aVal === bVal) return 0;
                const compare = aVal > bVal ? 1 : -1;
                return currentDirection === 'asc' ? compare : -compare;
            });
        }

        onFilteredChange(result, currentFilters);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setShowClear(hasActiveFilters(newFilters)); // <-- есть
        applyAndSend(newFilters, sortBy, sortDirection);
    };

    const handleSortChange = (newSortBy, newDirection) => {
        setSortBy(newSortBy);
        setSortDirection(newDirection);
        const defaultSort = sortOptions?.[0]?.value || '';
        const defaultDir = 'desc';
        const isDefault = newSortBy === defaultSort && newDirection === defaultDir;
        setIsSortChanged(!isDefault);
        setShowClear(hasActiveFilters(filters) || !isDefault);
        applyAndSend(filters, newSortBy, newDirection);
    };

    const clearFilters = () => {
        setFilters({});
        const defaultSort = sortOptions?.[0]?.value || '';
        setSortBy(defaultSort);
        setSortDirection('desc');
        setIsSortChanged(false);
        setShowClear(false);
        onFilteredChange([...projects], {});
    };

    const getUniqueValues = (key) => {
        const values = new Set();
        projects.forEach(p => {
            if (p[key]) {
                if (Array.isArray(p[key])) {
                    p[key].forEach(v => values.add(v));
                } else {
                    values.add(p[key]);
                }
            }
        });
        return Array.from(values).sort((a, b) => a.localeCompare(b, 'ru'));
    };

    const getValuesByFrequency = (key) => {
        const counts = {};
        projects.forEach(p => {
            const value = p[key];
            if (Array.isArray(value)) {
                value.forEach(v => {
                    counts[v] = (counts[v] || 0) + 1;
                });
            } else if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .sort((a, b) => {
                // Сначала по частоте (убывание)
                const diff = b[1] - a[1];
                if (diff !== 0) return diff;
                // Потом по алфавиту
                return a[0].localeCompare(b[0], 'ru');
            })
            .map(([val]) => val);
    };

    return (
        <div className="projectFilters">
            <input
                type="text"
                placeholder="Поиск по названию..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filterInput"
            />

            {/* Сортировка */}
            {sortOptions && sortOptions.length > 0 && (
                <div className="filterSort">
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value, sortDirection)}
                        className="filterSelect"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="sortDirectionBtn"
                        title={sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
                    >
                        {sortDirection === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            )}

            {config.map(cfg => {
                if (cfg.type === 'select') {
                    return (
                        <select
                            key={cfg.key}
                            value={filters[cfg.key] || 'all'}
                            onChange={(e) => handleFilterChange(cfg.key, e.target.value)}
                            className="filterSelect"
                        >
                            <option value="all">{cfg.label}: Все</option>
                            {getUniqueValues(cfg.key).map(val => (
                                <option key={val} value={val}>{cfg.label}: {val}</option>
                            ))}
                        </select>
                    );
                }
                if (cfg.type === 'checkbox') {
                    return (
                        <label key={cfg.key} className="filterCheckbox">
                            <input
                                type="checkbox"
                                checked={filters[cfg.key] || false}
                                onChange={(e) => handleFilterChange(cfg.key, e.target.checked)}
                            />
                            <span className='checkmark'>{cfg.label}</span>
                            <span className='checkbox'></span>
                        </label>
                    );
                }
                if (cfg.type === 'multi') {
                    return (
                        <MultiFilter
                            key={cfg.key}
                            label={cfg.label}
                            values={getValuesByFrequency(cfg.key)}
                            selected={filters[cfg.key] || []}
                            onChange={(newSelected) => handleFilterChange(cfg.key, newSelected)}
                        />
                    );
                }
                return null;
            })}

            {(showClear || isSortChanged) && (
                <button onClick={clearFilters} className="clearFilters">Сбросить</button>
            )}
        </div>
    );
}

function MultiFilter({ label, values, selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="multiFilter">
            <button onClick={() => setIsOpen(!isOpen)} className="filterSelect">
                {label} ({selected?.length || 0})
            </button>
            {isOpen && (
                <div className="multiFilterOptions">
                    {values.map(val => (
                        <label key={val}>
                            <input
                                type="checkbox"
                                checked={selected?.includes(val)}
                                onChange={(e) => {
                                    const newSelected = e.target.checked
                                        ? [...(selected || []), val]
                                        : selected.filter(v => v !== val);
                                    onChange(newSelected);
                                }}
                            />
                            {val}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}