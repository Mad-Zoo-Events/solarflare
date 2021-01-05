import React from "react";
import { connect } from "react-redux";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";
import { presetSorter } from "../../utils/utils";
import Page from "../Page/Page";
import "./ControlPanel.scss";
import { ControlPanelProps } from "./ControlPanelProps";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    presets,
    categorize
}:ControlPanelProps) => {
    const { commandPresets, dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets } = presets;
    const allPresets = (commandPresets as Preset[]).concat(dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets).sort(presetSorter);

    return (
        <Page isControlPanel={true}>
            <div className="control-panel__main-content-holder">
                {!categorize && allPresets.map((preset) => {
                    const { id, displayName } = preset;

                    return <PresetControl
                        key={id}
                        effectType="particle"
                        dispalyName={displayName}
                    />;
                })}
            </div>
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const presets = state.app.presets;
    const categorize = state.controlpanel.categorize;

    return {
        presets,
        categorize
    };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
