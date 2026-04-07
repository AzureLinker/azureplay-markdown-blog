import React from "react";

import Layout from "../components/layout";
import BackLogList from "../components/backloglist";
import Badges from "../components/bades";
import "./pages.css";

function Backlog () {
    return ( 
    <div>
        <Layout>
            <div className="windowBase">
                <div className="windowName"><span>Бэклог</span></div>
                <div className="windowContent"><BackLogList/></div>
                <Badges/>
            </div>
        </Layout>
    </div>
    )
};

export default Backlog