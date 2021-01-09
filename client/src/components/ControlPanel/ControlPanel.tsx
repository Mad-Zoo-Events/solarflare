import React from "react";
import { connect } from "react-redux";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import * as et from "../../domain/EffectType";
import { RootState } from "../../RootState";
import { combinePresets } from "../../utils/utils";
import Page from "../Page/Page";
import CategorySection from "./CategorySection/CategorySection";
import "./ControlPanel.scss";
import { ControlPanelProps } from "./ControlPanelProps";
import FooterControls from "./FooterControls/FooterControls";
import HeaderControls from "./HeaderControls/HeaderControls";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    presets,
    runningEffects,
    displayMode
}:ControlPanelProps) => {
    return (
        <Page
            isControlPanel={true}
            headerElements={<HeaderControls/>}
            footerElements={<FooterControls/>}
        >
            {displayMode === DisplayMode.Categorized && <div className="control-panel__categorized-holder">
                <CategorySection effectType={et.Command} presets={presets.commandPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Dragon} presets={presets.dragonPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Laser} presets={presets.laserPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Particle} presets={presets.particlePresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Potion} presets={presets.potionPresets} runningEffects={runningEffects}/>
                <CategorySection effectType={et.Timeshift} presets={presets.timeshiftPresets} runningEffects={runningEffects}/>
            </div>}

            {displayMode === DisplayMode.Uncategorized && <div className="control-panel__placeholder-category-holder">
                <CategorySection effectType={et.Command} presets={[]} runningEffects={[]}/>
                <CategorySection effectType={et.Dragon} presets={[]} runningEffects={[]}/>
                <CategorySection effectType={et.Laser} presets={[]} runningEffects={[]}/>
                <CategorySection effectType={et.Particle} presets={[]} runningEffects={[]}/>
                <CategorySection effectType={et.Potion} presets={[]} runningEffects={[]}/>
                <CategorySection effectType={et.Timeshift} presets={[]} runningEffects={[]}/>
            </div>}

            {displayMode === DisplayMode.Uncategorized && combinePresets(presets).map(preset =>
                <PresetControl
                    key={preset.id}
                    preset={preset}
                    secondsRunning={runningEffects.find(e => e.preset.id === preset.id)?.secondsRunning}
                />
            )}
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const { presets } = state.app;
    const { displayMode, runningEffects } = state.controlpanel;

    return {
        presets,
        runningEffects,
        displayMode
    };
}

export default connect(mapStateToProps, {})(ControlPanel);
