import React from "react";

function Badges () {
    return (
        <div style={{display: `flex`, justifyContent: `space-between`, alignItems: `center`, flexWrap: `wrap`, marginTop: `1em`}}>
            <a href="https://zianu-azureplay.neocities.org/" style={{imageRendering: `pixelated`}}>
                <img src="/barsNBadges/azureplay.gif" alt="AzurePlay Markdown Blog" style={{imageRendering: `pixelated`}}/>
            </a>
            <a href="http://neocities.org" style={{imageRendering: `pixelated`}}>
                <img src="/neocities.gif" alt="hosted by neocities" style={{imageRendering: `pixelated`}}/>
            </a>
        </div>
    )
}

export default Badges