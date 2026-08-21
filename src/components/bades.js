import React from "react";

function Badges () {

    return (
        <div style={{display: `flex`, justifyContent: `space-between`, alignItems: `center`, flexWrap: `wrap`, marginTop: `1em`}}>
            <a href="https://zianu-azureplay.neocities.org/" style={{imageRendering: `pixelated`}}>
                <img src="/barsNBadges/azureplay.gif" alt="AzurePlay Markdown Blog" style={{imageRendering: `pixelated`}}/>
            </a>
            <a href="http://www.ffforever.info">
                <img src="http://ffforever.info/pics/banners/ffforever.gif" width="88" height="31" border="0" alt="Final Fantasy Forever" style={{imageRendering: `pixelated`}}/>
            </a>
            <qtpoc-webring>
                <a href="https://qtpoc-ring.netlify.app/previous">&lt;&lt;</a>
                <a href="https://qtpoc-ring.netlify.app/random">?</a>
                <span>QTPOC Webring</span>
                <a href="https://qtpoc-ring.netlify.app">#</a>
                <a href="https://qtpoc-ring.netlify.app/next">&gt;&gt;</a>
            </qtpoc-webring>
            <a href="http://neocities.org" style={{imageRendering: `pixelated`}}>
                <img src="/neocities.gif" alt="hosted by neocities" style={{imageRendering: `pixelated`}}/>
            </a>
        </div>
    )
}

export default Badges