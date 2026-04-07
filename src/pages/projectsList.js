import React from "react";

import Layout from "../components/layout";
import Badges from "../components/bades";
import "./pages.css";

function Projects () {
    return ( 
    <div>
        <Layout>
            <div className="pageName"><h1>Проекты</h1></div>
            <div className="windowBase">
                <div className="windowName"><span>Игры</span></div>
                <div className="windowContent">
                    <div className="projectCard">
                        <div className="projectNameNMeta">
                            <div className="projectName">Yuri Academy: Big Contest</div>
                        </div>
                        <div className="projectMeta">
                            <p className="projectMetadata">PC - Заброшено</p>
                            <p className="projectMetadata">build.05172025</p>
                        </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc">
                                В академии начинается большой конкурс, и юная Чио-сан горит желанием в нём победить. Однако всё не так просто: среди конкурентов оказывается надоедливый вампир, который хочет победы ничуть не меньше и обязательно будет вставлять палки в колёса главной героине. К чему же всё это приведёт?<br/><br/>
                                Игра, созданная для Girly Game Jam 2025, и позже заброшенная из-за несформированной идеи геймпеля. Движок: RPG Maker MZ.
                            </div>
                            <div className="projectPicture">
                                <img src="/img/projects/games/yuriAcademy_GJDemo.png" alt="project cover"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            <iframe frameborder="0" src="https://itch.io/embed/3378568?bg_color=202020&amp;fg_color=ffffff&amp;link_color=ff0272&amp;border_color=484848" width="208" height="167"><a href="https://azureplay.itch.io/yuri-academy-big-contest">Yuri Academy: Big Contest by AzurePlay</a></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div className="windowBase">
                <div className="windowName"><span>Моды</span></div>
                <div className="windowContent">
                    <div className="projectCard">
                        <div className="projectNameNMeta">
                            <div className="projectName">Serious Sam: Alternative Timeline</div>
                        </div>
                        <div className="projectMeta">
                            <p className="projectMetadata">Serious Sam The Second Encounter - В разработке</p>
                            <p className="projectMetadata">v0.0.3</p>
                        </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc">
                                Сюжетный мод для Serious Sam TSE, рассказывающий альтернативную историю становления Серьёзного Сэма.<br/>
                                
                            </div>
                            <div className="projectPicture">
                                <img src="/img/projects/mods/SerSam_AltTimeLogo.png" alt="project cover"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            {/* <a href="#"></a> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="windowBase">
                <div className="windowName"><span>Уровни</span></div>
                <div className="windowContent">
                    <div className="projectCard">
                        <div className="projectNameNMeta">
                            <div className="projectName">Hoodlums Backyard Classic</div>
                        </div>
                        <div className="projectMeta">
                            <p className="projectMetadata">Serious Sam The Second Encounter - Вышел</p>
                            <p className="projectMetadata">v1.0.1</p>
                        </div>
                        <div className="projectDescNPicture">
                            <div className="projectDesc">
                                Начиная с этой карты, я начинаю переделывать все возможные ДМ карты из HD™, на классический Second Encounter™.<br/><br/>
                                Размер карты отличается от HD варианта, однако карта должна быть удобна.<br/><br/>
                                Установка: Перенесите .gro файл в корневую папку игры.
                            </div>
                            <div className="projectPicture">
                                <img src="https://www.serioussite.ru/_ld/31/3116.png" alt="project cover"/>
                            </div>
                        </div>
                        <div className="projectLinks">
                            <a href="https://www.serioussite.ru/load/0-0-0-3116-20">Скачать с SeriousSite</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="windowBase">
                <div className="windowName"><span>GitHub</span></div>
                <div className="windowContent">
                </div>
            </div>
            <Badges/>
        </Layout>
    </div>
    )
};

export default Projects