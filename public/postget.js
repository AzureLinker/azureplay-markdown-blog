const path = require("path");
const fs = require("fs");
const { title } = require("process");
const { timeStamp } = require("console");

const pagePath = path.join(__dirname, "../public/content");
let postList = [];

const getPosts = () => {
    fs.readdir(pagePath, (err, files) => { //читает директорию постов
        if (err) {
            return console.log("Не удалось прочитать директорию постов: " + err);
        }
        files.forEach((file, i) => { //каждый пост превращается в отдельный объект
            let obj = {};
            let post
            fs.readFile(`${pagePath}/${file}`, "utf8", (err, pageContent) => { //читает содержание файлов
                if (err) {
                    return console.log("Не удалось получить содержание постов: " + err);
                }
                const getMetadata = (acc, elem, i) => { //проверяет ---, которые отделяют метаданные
                    if (/^---/.test(elem)) {
                        acc.push(i)
                    }
                    return acc;
                };
                const parseMetadata = ({ lines, metadataIndicators }) => {
                    if (metadataIndicators.length > 0) {
                        let metadata = lines.slice(metadataIndicators[0] + 1, metadataIndicators[1]);
                        metadata.forEach(line => {
                            obj[line.split(": ")[0]] = line.split(": ")[1];
                        });
                        return obj;
                    }
                };
                const parseContent = ({ lines, metadataIndicators }) => {
                    if (metadataIndicators.length > 0) {
                        lines = lines.slice(metadataIndicators[1] + 1, lines.length);
                    }
                    return lines.join("\n")
                };
                const lines = pageContent.split("\n");
                const metadataIndicators = lines.reduce(getMetadata, []); //выделение ---
                const metadata = parseMetadata({ lines, metadataIndicators });
                const contents = parseContent({ lines, metadataIndicators });
                const date = new Date(metadata.created)
                const timestamp = date.getTime()
                const previewContent = contents.length > 256 ? contents.substring(0, 256) + "..." : contents;
                const mdPath = `${file}`;
                post = {
                    id: timestamp,
                    title: metadata.title ? metadata.title : "Пост без названия",
                    author: metadata.author ? metadata.author : "Автор не указан",
                    date: metadata.created ? metadata.created : "Дата не указана",
                    tags: metadata.tags ? metadata.tags.split(",").map(tag => tag.trim()) : [],
                    cover: metadata.cover ? metadata.cover : "Обложки нет",
                    content: previewContent ? previewContent : "Контент забыли",
                    mdPath: mdPath 
                }
                postList.push(post);
                if (i === files.length - 1) {
                    const sortedList = postList.sort ((a, b) => {
                        return a.id < b.id ? 1 : -1
                    })
                    let data = JSON.stringify(sortedList);
                    fs.writeFileSync("src/posts.json", data);
                    const allTags = postList.map(p => p.tags).flat();
                    
                    // Set оставит только уникальные, filter уберет пустые если они есть
                    const uniqueTags = [...new Set(allTags)].filter(tag => tag !== "");

                    // Сохраняем теги в отдельный файл
                    fs.writeFileSync("src/tags.json", JSON.stringify(uniqueTags, null, 2));
                    
                    console.log("Файлы posts.json и tags.json успешно созданы");
                }
            })
        })
    })
}

getPosts();