import React, { ReactElement, useEffect } from "react";
import PageHeader from "../presetmanager/PageHeader/PageHeader";
import "./ControlPanel.scss";

const ControlPanel = (): ReactElement => {
    useEffect(() => {
        document.getElementById("controlpanel-frame")?.focus();
    }, []);

    return (
        <>
            <PageHeader isControlPanel={true} />
            <div className="legacy-panel">
                <iframe id="controlpanel-frame" src={`${window.location.origin}/controlpanel`}></iframe>
            </div>
        </>
    );
};

export default ControlPanel;
