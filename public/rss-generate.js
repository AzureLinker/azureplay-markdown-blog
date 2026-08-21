const fs = require('fs');
const path = require('path');

// === НАСТРОЙКИ (поменяй под себя) ===
const POSTS_FILE = path.join(__dirname, '..', 'public', 'json', 'posts.json'); // путь к JSON с постами
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'rss.xml');
const SITE_URL = 'https://zianu-azureplay.neocities.org';
const BLOG_TITLE = 'Блог AzurePlay';
const BLOG_DESCRIPTION = 'Блог ZianU об играх, прохождениях и мыслях.';

function markdownToPlainText(md) {
    if (!md) return '';
    return md
        // Убираем HTML-теги (если есть в MD)
        .replace(/<[^>]+>/g, '')
        // Заголовки — просто текст
        .replace(/^#{1,6}\s+/gm, '')
        // Жирный и курсив
        .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, '$2')
        // Картинки — оставляем alt-текст
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        // Ссылки — оставляем текст ссылки
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Цитаты — убираем >
        .replace(/^>\s?/gm, '')
        // Код — убираем бэктики
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        // Горизонтальные линии
        .replace(/^[-*_]{3,}\s*$/gm, '')
        // Списки — убираем маркеры
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // Множественные переносы в один пробел
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ' ')
        // Множественные пробелы
        .replace(/\s{2,}/g, ' ')
        .trim();
}

// === ГЕНЕРАЦИЯ ===
function generateRss() {
    // Читаем и парсим JSON
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    const posts = JSON.parse(raw);

    // Сортируем от новых к старым
    const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const MAX_POSTS = 20;
    const recentPosts = sorted.slice(0, MAX_POSTS);

    // Собираем <item> для каждого поста
    const itemsXml = recentPosts.map(post => {
        const postUrl = `${SITE_URL}/#/post/${post.id}`;
        // RFC-822 дата для RSS (из твоего поля date, которое в формате YYYY-MM-DD)
        const pubDate = new Date(post.date).toUTCString();
        // description — plain-text версия начала контента (без HTML/Markdown)
        const description = markdownToPlainText(post.content).substring(0, 256);

    return `
        <item>
            <title>${escapeXml(post.title)}</title>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${pubDate}</pubDate>
            <description>${escapeXml(description)}</description>
            <author>${escapeXml(post.author)}</author>
            ${post.cover ? `<media:content url="${escapeXml(post.cover)}" medium="image"/>` : ''}
            ${post.cover ? `<enclosure url="${escapeXml(post.cover)}" type="image/jpeg" length="0"/>` : ''}
            ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
        </item>`;
    }).join('');

    // Финальный RSS
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
        <channel>
            <title>${escapeXml(BLOG_TITLE)}</title>
            <link>${SITE_URL}</link>
            <description>${escapeXml(BLOG_DESCRIPTION)}</description>
            <language>ru</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
            ${itemsXml}
        </channel>
    </rss>`;

    fs.writeFileSync(OUTPUT_FILE, rssXml, 'utf-8');
    console.log(`RSS сгенерирован: ${OUTPUT_FILE} взято последние (${recentPosts.length} постов)`);
}

    // Экранирование спецсимволов XML
    function escapeXml(str) {
        if (!str) return '';
        return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

generateRss();