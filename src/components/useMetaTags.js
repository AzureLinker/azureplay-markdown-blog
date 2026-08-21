import { useEffect } from 'react';

export default function useMetaTags({ title, description, image, url, type = 'website' }) {
    useEffect(() => {
        if (!title) return;

        const setMeta = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Сохраняем старые значения
        const metaProperties = [
            'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
            'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'
        ];
        const previousValues = {};
        metaProperties.forEach(prop => {
            const existing = document.querySelector(`meta[property="${prop}"]`);
            previousValues[prop] = existing ? existing.getAttribute('content') : null;
        });

        // Устанавливаем новые
        setMeta('og:title', title);
        setMeta('og:description', description || '');
        setMeta('og:image', image || '');
        setMeta('og:url', url || window.location.href);
        setMeta('og:type', type);
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', title);
        setMeta('twitter:description', description || '');
        setMeta('twitter:image', image || '');

        // Возвращаем старые при размонтировании
        return () => {
            metaProperties.forEach(prop => {
                if (previousValues[prop]) {
                    setMeta(prop, previousValues[prop]);
                }
            });
        };
    }, [title, description, image, url, type]);
}