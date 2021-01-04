import React, { ReactElement } from "react";
import Page from "../Page/Page";
import "./ControlPanel.scss";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = (): ReactElement => {
    return (
        <Page isControlPanel={true}>
            <div className="control-panel__main-content-holder">
                <PresetControl effectType="particle" dispalyName="Particle" />
                <PresetControl effectType="laser" isGuardianLaser dispalyName="Lazer" />
            </div>
        </Page>
    );
};

export default ControlPanel;
