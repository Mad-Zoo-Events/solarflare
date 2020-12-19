import React, { ReactElement, useEffect } from "react";
import Page from "../Page/Page";
import "./ControlPanel.scss";

const ControlPanel = (): ReactElement => {
    useEffect(() => {
        document.getElementById("controlpanel-frame")?.focus();
    }, []);

    return (
        <Page isControlPanel={true} version="0">
            <div className="legacy-panel">
                <iframe id="controlpanel-frame" src={`${window.location.origin}/controlpanel`}></iframe>
            </div>
        </Page>
    );
};

export default ControlPanel;
