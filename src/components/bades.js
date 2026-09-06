import React from "react";
import "./components.css";

function Badges () {

    return (
        <div className="badgesComponent">
            <a href="https://zianu-azureplay.neocities.org/"  title="AzurePlay Markdown Blog">
                <img src="/barsNBadges/azureplay.gif" alt="AzurePlay Markdown Blog" style={{imageRendering: `pixelated`}}/>
            </a>
            <a href="http://www.ffforever.info" title="Final Fantasy Forever">
                <img src="http://ffforever.info/pics/banners/ffforever.gif" width="88" height="31" border="0" alt="Final Fantasy Forever" style={{imageRendering: `pixelated`}}/>
            </a>
            <a href="https://atabook.org/" title="Atabook">
                <img src="https://atabook.org/images/button.gif" width="88" height="31" border="0" alt="Atabook" style={{imageRendering: `pixelated`}}/>
            </a>
            <qtpoc-webring widget="bordered" style={{display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center'}}>
                <span className="QTPOC">QTPOC Webring</span>
                <div className="QTPOCFlex">
                    <a href="https://qtpoc-ring.netlify.app/previous">⏴</a>
                    <a href="https://qtpoc-ring.netlify.app/random">?</a>
                    <a href="https://qtpoc-ring.netlify.app">#</a>
                    <a href="https://qtpoc-ring.netlify.app/next">⏵</a>
                </div>
            </qtpoc-webring>
            <script async="" charset="utf-8" src="https://qtpoc-ring.netlify.app/embed.js"></script>
            <a href="http://neocities.org" title="hosted by neocities">
                <img src="/neocities.gif" alt="hosted by neocities" style={{imageRendering: `pixelated`}}/>
            </a>
        </div>
    )
}

export default Badges