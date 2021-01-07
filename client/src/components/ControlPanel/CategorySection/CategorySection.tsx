import React, { ReactElement } from "react";
import * as et from "../../../domain/EffectType";
import { getAccentColor } from "../../../utils/utils";
import PresetControl from "../PresetControl/PresetControl";
import "./CategorySection.scss";
import { CategorySectionProps } from "./CategorySectionProps";

const CategorySection = ({
    presets,
    runningEffects,
    effectType
}: CategorySectionProps): ReactElement => {
    let header = "";
    switch (effectType) {
    case et.Command:
        header = "CMD";
        break;
    case et.Dragon:
        header = "DRGN";
        break;
    case et.Laser:
        header = "LZR";
        break;
    case et.Particle:
        header = "PTCL";
        break;
    case et.Potion:
        header = "PTN";
        break;
    case et.Timeshift:
        header = "SHFT";
        break;
    }

    const color = getAccentColor(effectType);
    const coloredText = { borderColor: `var(--${color})`, color: `var(--${color})` };
    const coloredBackground = { backgroundColor: `var(--${color}-alpha)` };

    return (
        <div className={`control-panel__category-section ${effectType}-controls`} style={coloredBackground}>
            <div className="header" style={coloredText}>
                <span>{header}</span>
            </div>
            {presets.map((preset) => {
                return <PresetControl
                    key={preset.id}
                    preset={preset}
                    secondsRunning={runningEffects.get(preset.id)?.secondsRunning}
                />;
            })}
        </div>
    );
};

export default CategorySection;
