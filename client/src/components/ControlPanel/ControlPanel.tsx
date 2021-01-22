import React from "react";
import { connect } from "react-redux";
import { selectCombinedPresets, selectCombinedPresetsWithoutCommands, selectPresets } from "../../AppSelectors";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import * as et from "../../domain/EffectType";
import { RootState } from "../../RootState";
import Page from "../Page/Page";
import CategorySection from "./CategorySection/CategorySection";
import "./ControlPanel.scss";
import { handleKeyPress } from "./ControlPanelActions";
import { ControlPanelProps } from "./ControlPanelProps";
import { selectClockTapButtonRef, selectDisplayMode, selectIgnoreKeystrokes, selectRunningEffects } from "./ControlPanelSelectors";
import FooterControls from "./FooterControls/FooterControls";
import HeaderControls from "./HeaderControls/HeaderControls";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    displayMode,
    ignoreKeystrokes,
    presets,
    combinedPresets,
    combinedPresetsWithoutCommands,
    runningEffects,
    clockTapButtonRef,
    handleKeyPress
}: ControlPanelProps) => {
    const doClockTap = (b: HTMLDivElement | null) => {
        if (!b) return;
        b.click();
        b.classList.add("button-active");
        setTimeout(() => b.classList.remove("button-active"), 100);
    };

    document.onkeydown = e => {
        if (!ignoreKeystrokes) {
            e.key === "+"
                ? doClockTap(clockTapButtonRef.current)
                : handleKeyPress(e, combinedPresets, runningEffects);
        }
    };

    const getChildren = () => {
        switch (displayMode) {
        case DisplayMode.Categorized:
            return (
                <div className="control-panel__categorized-holder">
                    <CategorySection effectType={et.Dragon} presets={presets.dragonPresets} />
                    <CategorySection effectType={et.Laser} presets={presets.laserPresets} />
                    <CategorySection effectType={et.Particle} presets={presets.particlePresets} />
                    <CategorySection effectType={et.Potion} presets={presets.potionPresets} />
                    <CategorySection effectType={et.Timeshift} presets={presets.timeshiftPresets} />
                    <CategorySection effectType={et.Command} presets={presets.commandPresets} />
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
                {combinedPresetsWithoutCommands.map(preset =>
                    <PresetControl
                        key={preset.id}
                        preset={preset}
                    />
                )}
                <CategorySection effectType={et.Command} presets={presets.commandPresets} />
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
    const presets = selectPresets(state);
    const combinedPresets = selectCombinedPresets(state);
    const combinedPresetsWithoutCommands = selectCombinedPresetsWithoutCommands(state);
    const runningEffects = selectRunningEffects(state);
    const displayMode = selectDisplayMode(state);
    const ignoreKeystrokes = selectIgnoreKeystrokes(state);
    const clockTapButtonRef = selectClockTapButtonRef(state);

    return {
        presets,
        combinedPresets,
        combinedPresetsWithoutCommands,
        runningEffects,
        displayMode,
        ignoreKeystrokes,
        clockTapButtonRef
    };
}

const mapDispatchToProps = {
    handleKeyPress: handleKeyPress
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
