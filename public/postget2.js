const path = require("path");
const fs = require("fs");

const pagePath = path.join(__dirname, "../public/content");
const postsOutputPath = path.join(__dirname, "../public/json/posts.json");
const tagsOutputPath = path.join(__dirname, "../public/json/tags.json");

const getPosts = () => {
    try {
        const files = fs.readdirSync(pagePath);
        const postList = [];
        const allTags = new Set();
        const tagCounts = {};

        files.forEach((file) => {
            if (path.extname(file) !== ".md") return;

            const filePath = path.join(pagePath, file);
            const pageContent = fs.readFileSync(filePath, "utf8");
            const lines = pageContent.split(/\r?\n/);
            
            const metadataIndicators = [];
            lines.forEach((line, index) => {
                if (/^---/.test(line)) {
                    metadataIndicators.push(index);
                }
            });

            if (metadataIndicators.length >= 2) {
                const rawMetadata = {};
                const metadataLines = lines.slice(metadataIndicators[0] + 1, metadataIndicators[1]);
                
                metadataLines.forEach(line => {
                    const colonIndex = line.indexOf(": ");
                    if (colonIndex !== -1) {
                        const key = line.slice(0, colonIndex).trim();
                        const value = line.slice(colonIndex + 2).trim();
                        rawMetadata[key] = value;
                    }
                });

                let tagsArray = [];
                if (rawMetadata.tags) {
                    tagsArray = rawMetadata.tags.split(",").map(tag => tag.trim());
                    tagsArray.forEach(tag => {
                        allTags.add(tag);
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1; // <-- добавить: увеличить счётчик
                    });
                }

                const dateStr = rawMetadata.created || "";
                const id = dateStr ? new Date(dateStr).getTime() : Date.now();

                // 1. Получаем полный текст статьи
                const contentLines = lines.slice(metadataIndicators[1] + 1);
                let content = contentLines.join("\n");

                // 2. Обрезаем контент до 256 символов и добавляем многоточие
                if (content.length > 256) {
                    content = content.slice(0, 256) + "...";
                }

                const postObj = {
                    id: id,
                    title: rawMetadata.title || "",
                    author: rawMetadata.author || "",
                    date: dateStr,
                    tags: tagsArray,
                    cover: rawMetadata.cover || "",
                    content: content,
                    mdPath: file
                };

                postList.push(postObj);
            }
        });



        postList.sort((a, b) => b.id - a.id);

        fs.writeFileSync(postsOutputPath, JSON.stringify(postList, null, 2), "utf8");

                        // Сортировка тегов: по убыванию популярности, потом по алфавиту
        const tagsList = Array.from(allTags).sort((a, b) => {
            const countDiff = tagCounts[b] - tagCounts[a]; // по убыванию
            if (countDiff !== 0) return countDiff;
            return a.localeCompare(b); // по алфавиту, если счётчики равны
        });
        fs.writeFileSync(tagsOutputPath, JSON.stringify(tagsList, null, 2), "utf8");

        console.log(`Успешно! Создано постов: ${postList.length}, найдено уникальных тегов: ${tagsList.length}`);

    } catch (err) {
        console.error("Произошла ошибка во время сборки:", err);
    }
};

getPosts();