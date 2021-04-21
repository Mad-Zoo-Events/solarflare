import React, { useEffect } from "react";
import { connect } from "react-redux";
import { selectCombinedPresets } from "../../AppSelectors";
import { allEffectTypes } from "../../domain/EffectType";
import { RootState } from "../../RootState";
import Page from "../Page/Page";
import CategoryGrid from "./CategoryGrid/CategoryGrid";
import CategorySection from "./CategorySection/CategorySection";
import "./ControlPanel.scss";
import { handleKeyPress, setIgnoreKeystrokes } from "./ControlPanelActions";
import { ControlPanelProps } from "./ControlPanelProps";
import { selectClockTapButtonRef, selectDisplayCategories, selectIgnoreKeystrokes, selectRunningEffects } from "./ControlPanelSelectors";
import FooterControls from "./FooterControls/FooterControls";
import HeaderControls from "./HeaderControls/HeaderControls";
import PresetControl from "./PresetControl/PresetControl";

const ControlPanel = ({
    displayCategories,
    combinedPresets,
    loosePresets,
    runningEffects,
    ignoreKeystrokes,
    clockTapButtonRef,

    handleKeyPress,
    setIgnoreKeystrokes
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

    useEffect(() => {
        setIgnoreKeystrokes(false);
        return () => {
            setIgnoreKeystrokes(true);
        };
    }, []);

    return (
        <Page
            headerElements={<HeaderControls/>}
            footerElements={<FooterControls/>}
        >
            {/* Category placeholders with per-effect-type controls */}
            {displayCategories.length < allEffectTypes.length &&
                    <div className="control-panel__placeholder-category-holder">
                        {allEffectTypes.filter(et => !displayCategories.includes(et)).map(effectType => (
                            <CategorySection key={`placeholder-${effectType}`} effectType={effectType}/>
                        ))}
                    </div>
            }

            {loosePresets.map(preset =>
                <PresetControl
                    key={preset.id}
                    preset={preset}
                />
            )}

            {/* Category sections with corresponding presets */}
            <CategoryGrid/>
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const displayCategories = selectDisplayCategories(state);
    const combinedPresets = selectCombinedPresets(state);
    const loosePresets = selectCombinedPresets(state, displayCategories);
    const runningEffects = selectRunningEffects(state);
    const ignoreKeystrokes = selectIgnoreKeystrokes(state);
    const clockTapButtonRef = selectClockTapButtonRef(state);

    return {
        displayCategories,
        combinedPresets,
        loosePresets,
        runningEffects,
        ignoreKeystrokes,
        clockTapButtonRef
    };
}

const mapDispatchToProps = {
    handleKeyPress: handleKeyPress,
    setIgnoreKeystrokes: setIgnoreKeystrokes
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
