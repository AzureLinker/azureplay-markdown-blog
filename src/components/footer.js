import React from "react";
import packageJson from '../../package.json';
import "./components.css"
import { SiYoutube } from "react-icons/si";
import { SiTelegram } from "react-icons/si";
import { SiDiscord } from "react-icons/si";
import { SiTwitch } from "react-icons/si";
import { SiBoosty } from "react-icons/si";
import { SiGamejolt } from "react-icons/si";
import { SiItchdotio } from "react-icons/si";
import { SiGithub } from "react-icons/si";
import { SiRss } from "react-icons/si";

function Footer () {
    return (
        <div className="siteFooter">
            <div className="siteCopyright">AzurePlay &copy; 2026 - {new Date().getFullYear()}. Все материалы на этом сайте доступны по лицензии <a href="https://creativecommons.org/licenses/by/4.0/" className="" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></div>
            <div className="siteCopyright siteVersion">v{packageJson.version}</div>
            <div className="siteSocials">
                <a href="https://www.youtube.com/@zianuazureplay" className="footerSocial socialYT" target="_blank" rel="noopener noreferrer"><SiYoutube /></a>
                <a href="https://www.youtube.com/@lazurnya" className="footerSocial socialYT" target="_blank" rel="noopener noreferrer"><SiYoutube /></a>
                <a href="https://t.me/zianubaraholka" className="footerSocial socialTG" target="_blank" rel="noopener noreferrer"><SiTelegram /></a>
                <a href="https://discord.com/invite/YGryhcRWqM" className="footerSocial socialDsicord" target="_blank" rel="noopener noreferrer"><SiDiscord /></a>
                <a href="https://boosty.to/zianu" className="footerSocial socialBoosty" target="_blank" rel="noopener noreferrer"><SiBoosty /></a>
                <a href="https://github.com/AzureLinker/azureplay-markdown-blog" className="footerSocial socialGit" target="_blank" rel="noopener noreferrer"><SiGithub /></a>
                <a href="https://gamejolt.com/@AzurePlay" className="footerSocial socialGJ" target="_blank" rel="noopener noreferrer"><SiGamejolt /></a>
                <a href="https://azureplay.itch.io/" className="footerSocial socialItch" target="_blank" rel="noopener noreferrer"><SiItchdotio /></a>
                <a href="https://www.twitch.tv/zianuvtube" className="footerSocial socialTwitch" target="_blank" rel="noopener noreferrer"><SiTwitch /></a>
                <a href="https://zianu-azureplay.neocities.org/rss.xml" className="footerSocial socialRSS" target="_blank" rel="noopener noreferrer"><SiRss /></a>
            </div>
        </div>
    )
}

export default Footer