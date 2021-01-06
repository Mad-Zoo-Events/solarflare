import React, { ReactElement } from "react";
import * as et from "../../../domain/EffectType";
import { LaserPreset } from "../../../domain/presets";
import { getAccentColor, getShortcutString } from "../../../utils/utils";
import PresetControlButton from "../PresetControlButton/PresetControlButton";
import "./PresetControl.scss";
import { PresetControlProps } from "./PresetControlProps";

const PresetControl = ({
    preset
}: PresetControlProps): ReactElement => {
    const { effectType, displayName, keyBinding } = preset;

    if (!effectType) {
        return <span>?</span>;
    }

    const renderStartStop =
    effectType === et.Dragon ||
    effectType === et.Laser ||
    effectType === et.Particle ||
    effectType === et.Potion ||
    effectType === et.Timeshift;

    const isGuardianLaser = effectType === et.Laser && (preset as LaserPreset).laserType !== "end";

    const color = getAccentColor(effectType);
    const coloredText = { borderColor: `var(--${color})`, color: `var(--${color})` };
    const keyBindingStr = getShortcutString(keyBinding);

    return (
        <div className="control-panel__visual-control">
            <span style={coloredText}>{displayName}</span>

            {effectType === et.Command && <>
                <PresetControlButton action="run" color="steel" keyBinding={keyBindingStr}/>
            </>}

            {effectType === et.Dragon && <>
                <PresetControlButton action="restart" color="orange"/>
            </>}

            {effectType === et.Laser && isGuardianLaser && <>
                <PresetControlButton action="color" color="indigo"/>
            </>}

            {effectType === et.Particle && <>
                <PresetControlButton action="trigger" color="orange"/>
            </>}

            {renderStartStop && <>
                <PresetControlButton action="start" color="green" keyBinding={keyBindingStr}/>
                <PresetControlButton action="stop" color="red"/>
            </>}
        </div>
    );
};

export default PresetControl;
