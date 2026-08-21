import React from "react";
import ScrollToTop from "react-scroll-to-top";
import Layout from "../components/layout";
import BackLogList from "../components/backloglist";
import Badges from "../components/bades";
import "./pages.css";
import useMetaTags from "../components/useMetaTags";
import usePageMeta from "../components/usePageMeta";

function Backlog () {
    usePageMeta({
        title: 'Бэклог AzurePlay | Markdown Blog',
        description: 'Cписок игр, которые создательница играла, или не играла.',
        keywords: ['бэклог', 'игры', 'прохождения', 'AzurePlay'],
    });
    useMetaTags({
        title: 'Бэклог AzurePlay',
        description: 'Тут список игр, которые создательница играла, или не играла. Полный список игр, короче.',
        image: 'https://zianu-azureplay.neocities.org/img/blog-covers/BlogPostPreview-compressed.png',
        url: 'https://zianu-azureplay.neocities.org/#/backlog',
        type: 'website',
    });
    return ( 
    <div>
        <Layout>
            <div className="windowBase">
                <div className="windowName"><span>Бэклог</span></div>
                <div className="windowContent"><BackLogList/></div>
                <Badges/>
            </div>
        </Layout>
        <ScrollToTop smooth />
    </div>
    )
};

export default Backlog