import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import * as et from "../../../domain/EffectType";
import { getAccentColor } from "../../../utils/utils";
import { stopAll } from "../ControlPanelActions";
import PresetControl from "../PresetControl/PresetControl";
import "./CategorySection.scss";
import { CategorySectionProps } from "./CategorySectionProps";

const CategorySection = ({
    presets,
    effectType,
    stopAll
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
    case et.Lightning:
        header = "LTNG";
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
                <FontAwesomeIcon
                    className="button"
                    icon={["fas", "stop-circle"]}
                    size="lg"
                    title="Stop Effects + Detach Clocks"
                    onClick={() => stopAll({ stopEffects: true, detachClocks: true, specificTypeOnly: effectType })}
                />
                <FontAwesomeIcon
                    className="button"
                    icon={["far", "stop-circle"]}
                    size="lg"
                    title="Stop Effects"
                    onClick={() => stopAll({ stopEffects: true, detachClocks: false, specificTypeOnly: effectType })}
                />
                <FontAwesomeIcon
                    className="button"
                    icon={["fas", "stopwatch"]}
                    size="lg"
                    title="Detach Clocks"
                    onClick={() => stopAll({ stopEffects: false, detachClocks: true, specificTypeOnly: effectType })}
                />
                <span>{header}</span>
            </div>
            {presets?.map((preset) => {
                return <PresetControl
                    key={preset.id}
                    preset={preset}
                />;
            })}
        </div>
    );
};

const mapDispatchToProps = {
    stopAll: stopAll
};

export default connect(null, mapDispatchToProps)(CategorySection);
