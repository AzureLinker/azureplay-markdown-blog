import { useEffect } from 'react';

export default function usePageMeta({ title, description, keywords }) {
    useEffect(() => {
        // Меняем title
        if (title) {
            document.title = title;
        }

        // Меняем description
        if (description) {
            let meta = document.head.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'description');
                document.head.appendChild(meta); // <-- head, не body
            }
            meta.setAttribute('content', description);
        }

        // Меняем keywords
        if (keywords) {
            let metaKw = document.querySelector('meta[name="keywords"]');
            if (!metaKw) {
                metaKw = document.createElement('meta');
                metaKw.setAttribute('name', 'keywords');
                document.head.appendChild(metaKw);
            }
            metaKw.setAttribute('content', keywords.join(', '));
        }

        // При размонтировании возвращаем базовые значения
        return () => {
            // Можно вернуть дефолтные значения из index.html
        };
    }, [title, description, keywords]);
}