import React from "react";
import { connect } from "react-redux";
import { selectCombinedPresets, selectPresets } from "../../AppSelectors";
import { allEffectTypes } from "../../domain/EffectType";
import { RootState } from "../../RootState";
import { getPresetsOfType } from "../../utils/utils";
import Page from "../Page/Page";
import CategorySection from "./CategorySection/CategorySection";
import "./ControlPanel.scss";
import { handleKeyPress } from "./ControlPanelActions";
import { ControlPanelProps } from "./ControlPanelProps";
import { selectClockTapButtonRef, selectDisplayCategories, selectIgnoreKeystrokes, selectRunningEffects } from "./ControlPanelSelectors";
import FooterControls from "./FooterControls/FooterControls";
import HeaderControls from "./HeaderControls/HeaderControls";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    displayCategories,
    ignoreKeystrokes,
    presets,
    combinedPresets,
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

    return (
        <Page
            isControlPanel={true}
            headerElements={<HeaderControls/>}
            footerElements={<FooterControls/>}
        >
            <>
                {/* Category placeholders with per-effect-type controls */}
                {displayCategories.length < allEffectTypes.length
                    ? (<div className="control-panel__placeholder-category-holder">
                        {allEffectTypes.filter(et => !displayCategories.includes(et)).map(effectType => (
                            <CategorySection key="effectType" effectType={effectType}/>
                        ))}
                    </div>)
                    : null
                }

                {/* "loose" presets */}
                {combinedPresets.map(preset =>
                    <PresetControl
                        key={preset.id}
                        preset={preset}
                    />
                )}

                {/* Category sections with corresponding presets */}
                {displayCategories.length > 0
                    ? (<div className="control-panel__categorized-holder">
                        {displayCategories.map(effectType => (
                            <CategorySection key="effectType" effectType={effectType} presets={getPresetsOfType(effectType, presets)} />
                        ))}
                    </div>)
                    : null
                }
            </>
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const presets = selectPresets(state);
    const displayCategories = selectDisplayCategories(state);
    const combinedPresets = selectCombinedPresets(state, displayCategories);
    const runningEffects = selectRunningEffects(state);
    const ignoreKeystrokes = selectIgnoreKeystrokes(state);
    const clockTapButtonRef = selectClockTapButtonRef(state);

    return {
        presets,
        combinedPresets,
        runningEffects,
        displayCategories,
        ignoreKeystrokes,
        clockTapButtonRef
    };
}

const mapDispatchToProps = {
    handleKeyPress: handleKeyPress
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
