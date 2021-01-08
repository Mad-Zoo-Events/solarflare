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
    runningEffects,
    categorize
}:ControlPanelProps) => {
    return (
        <Page isControlPanel={true} headerElements={<HeaderControls/>}>
            {categorize && <div className="control-panel__categorized-holder">
                <CategorySection effectType={et.Command} presets={presets.commandPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Dragon} presets={presets.dragonPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Laser} presets={presets.laserPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Particle} presets={presets.particlePresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Potion} presets={presets.potionPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Timeshift} presets={presets.timeshiftPresets} runningEffects={runningEffects}/>
            </div>}

            {!categorize && <div className="control-panel__placeholder-category-holder">
                <CategorySection effectType={et.Command} presets={[]} runningEffects={new Map()}/>
                <CategorySection effectType={et.Dragon} presets={[]} runningEffects={new Map()}/>
                <CategorySection effectType={et.Laser} presets={[]} runningEffects={new Map()}/>
                <CategorySection effectType={et.Particle} presets={[]} runningEffects={new Map()}/>
                <CategorySection effectType={et.Potion} presets={[]} runningEffects={new Map()}/>
                <CategorySection effectType={et.Timeshift} presets={[]} runningEffects={new Map()}/>
            </div>}

            {!categorize && combinePresets(presets).sort(presetSorter).map(preset =>
                <PresetControl key={preset.id} preset={preset} secondsRunning={runningEffects.get(preset.id)?.secondsRunning}/>
            )}
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const { presets } = state.app;
    const { categorize, runningEffects } = state.controlpanel;

    return {
        presets,
        runningEffects,
        categorize
    };
}

export default connect(mapStateToProps, {})(ControlPanel);
