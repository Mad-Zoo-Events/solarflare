import React from "react";
import { connect } from "react-redux";
import * as et from "../../domain/EffectType";
import { RootState } from "../../RootState";
import { combinePresets, presetSorter } from "../../utils/utils";
import Page from "../Page/Page";
import CategorySection from "./CategorySection/CategorySection";
import "./ControlPanel.scss";
import { ControlPanelProps } from "./ControlPanelProps";
import HeaderControls from "./HeaderControls/HeaderControls";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    presets,
    categorize,
    runningEffects
}:ControlPanelProps) => {
    console.log(runningEffects);

    return (
        <Page isControlPanel={true} headerElements={<HeaderControls/>}>
            {categorize && <div className="control-panel__categorized-holder">
                <CategorySection effectType={et.Command} presets={presets.commandPresets}/>
                <CategorySection effectType={et.Dragon} presets={presets.dragonPresets}/>
                <CategorySection effectType={et.Laser} presets={presets.laserPresets}/>
                <CategorySection effectType={et.Particle} presets={presets.particlePresets}/>
                <CategorySection effectType={et.Potion} presets={presets.potionPresets}/>
                <CategorySection effectType={et.Timeshift} presets={presets.timeshiftPresets}/>
            </div>}

            {!categorize && combinePresets(presets).sort(presetSorter).map(preset =>
                <PresetControl key={preset.id} preset={preset}/>
            )}
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const presets = state.app.presets;
    const { categorize, runningEffects } = state.controlpanel;

    return {
        presets,
        categorize,
        runningEffects
    };
}

export default connect(mapStateToProps, {})(ControlPanel);
