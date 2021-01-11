import React from "react";
import { connect } from "react-redux";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import * as et from "../../domain/EffectType";
import { RootState } from "../../RootState";
import { combinePresets, combinePresetsWithoutCommands } from "../../utils/utils";
import Page from "../Page/Page";
import CategorySection from "./CategorySection/CategorySection";
import "./ControlPanel.scss";
import { handleKeyPress } from "./ControlPanelActions";
import { ControlPanelProps } from "./ControlPanelProps";
import FooterControls from "./FooterControls/FooterControls";
import HeaderControls from "./HeaderControls/HeaderControls";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    presets,
    runningEffects,
    displayMode,
    handleKeyPress
}:ControlPanelProps) => {
    const combinedPresets = combinePresets(presets);
    document.onkeydown = e => handleKeyPress(e, combinedPresets, runningEffects);

    const getChildren = () => {
        switch (displayMode) {
        case DisplayMode.Categorized:
            return (
                <div className="control-panel__categorized-holder">
                    <CategorySection effectType={et.Dragon} presets={presets.dragonPresets} runningEffects={runningEffects}/>
                    <CategorySection effectType={et.Laser} presets={presets.laserPresets} runningEffects={runningEffects}/>
                    <CategorySection effectType={et.Particle} presets={presets.particlePresets} runningEffects={runningEffects}/>
                    <CategorySection effectType={et.Potion} presets={presets.potionPresets} runningEffects={runningEffects}/>
                    <CategorySection effectType={et.Timeshift} presets={presets.timeshiftPresets} runningEffects={runningEffects}/>
                    <CategorySection effectType={et.Command} presets={presets.commandPresets} runningEffects={runningEffects}/>
                </div>
            );
        case DisplayMode.Uncategorized:
            return (<>
                <div className="control-panel__placeholder-category-holder">
                    <CategorySection effectType={et.Dragon} />
                    <CategorySection effectType={et.Laser} />
                    <CategorySection effectType={et.Particle} />
                    <CategorySection effectType={et.Potion} />
                    <CategorySection effectType={et.Timeshift} />
                    <CategorySection effectType={et.Command} />
                </div>
                {combinedPresets.map(preset =>
                    <PresetControl
                        key={preset.id}
                        preset={preset}
                        secondsRunning={runningEffects.find(e => e.preset.id === preset.id)?.secondsRunning}
                    />
                )}
            </>);
        case DisplayMode.SeparateCommands:
            return (<>
                <div className="control-panel__placeholder-category-holder">
                    <CategorySection effectType={et.Dragon} />
                    <CategorySection effectType={et.Laser} />
                    <CategorySection effectType={et.Particle} />
                    <CategorySection effectType={et.Potion} />
                    <CategorySection effectType={et.Timeshift} />
                </div>
                {combinePresetsWithoutCommands(presets).map(preset =>
                    <PresetControl
                        key={preset.id}
                        preset={preset}
                        secondsRunning={runningEffects.find(e => e.preset.id === preset.id)?.secondsRunning}
                    />
                )}
                <CategorySection effectType={et.Command} presets={presets.commandPresets} runningEffects={runningEffects}/>
            </>);
        }
    };

    return (
        <Page
            isControlPanel={true}
            headerElements={<HeaderControls/>}
            footerElements={<FooterControls/>}
        >
            {getChildren()}
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

const mapDispatchToProps = {
    handleKeyPress: handleKeyPress
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
