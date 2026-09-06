import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import Badges from "../components/bades";
import Guestbook from "../components/Guestbook";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function GuestbookPage() {
    usePageMeta({
        title: 'Гостевая книга | AzurePlay',
        description: 'Оставьте сообщение в гостевой книге AzurePlay.',
        keywords: ['гостевая книга', 'guestbook', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Гостевая книга AzurePlay',
        description: 'Оставьте сообщение в гостевой книге AzurePlay.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/guestbook',
        type: 'website',
    });

    return (
        <div>
            <Layout>
                <div className="pageName"><h1>Гостевая книга</h1></div>
                <div className="windowGroup-2row">
                    <Guestbook />
                    <div className="windowBase windowBlogTags windowPostChapters">
                        <div className="windowName"><span>Правила</span></div>
                        <div className="windowContent" style={{padding: '0 1em'}}>
                            <p style={{fontSize: '24px', fontWeight: 'bolder', width: '100%', textAlign: 'center'}}>В гостевой книге запрещено:</p>
                            <ul>
                                <li style={{marginBottom: '1em'}}>Запрещены оскорбления в любой форме, издевательства, провокация, агрессия, моральное давление и дискриминация по любому признаку.</li>
                                <li style={{marginBottom: '1em'}}>Безосновательная критика людей будет расценена как оскорбление и провокация</li>
                                <li style={{marginBottom: '1em'}}>Запрещена публикация какой-либо личной информации человека без согласия (любые данные, которые классифицируются, как персональная информация).</li>
                                <li style={{marginBottom: '1em'}}>Запрещено распространение порнографических материалов.</li>
                                <li style={{marginBottom: '1em'}}>Запрещено обсуждение и публикации любого материала на темы: фашизма, нацизма, экстремизма, наркотиков, политики.</li>
                                <li style={{marginBottom: '1em'}}>На сервере запрещено размещение какой-либо рекламы.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Badges />
            </Layout>
            <ScrollToTop smooth />
        </div>
    );
}

export default GuestbookPage;