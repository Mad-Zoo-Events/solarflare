import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../RootState";
import { combinePresets, presetSorter } from "../../utils/utils";
import Page from "../Page/Page";
import "./ControlPanel.scss";
import { ControlPanelProps } from "./ControlPanelProps";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    presets,
    categorize
}:ControlPanelProps) => {
    const allPresets = combinePresets(presets).sort(presetSorter);

    return (
        <Page isControlPanel={true}>
            <div className="control-panel__main-content-holder">
                {!categorize && allPresets.map((preset) => {
                    return <PresetControl
                        key={preset.id}
                        preset= {preset}
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
