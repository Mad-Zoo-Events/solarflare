import React, { ReactElement } from "react";
import * as ea from "../../../domain/EffectAction";
import * as et from "../../../domain/EffectType";
import { LaserPreset } from "../../../domain/presets";
import { getAccentColor } from "../../../utils/utils";
import PresetControlButton from "../PresetControlButton/PresetControlButton";
import "./PresetControl.scss";
import { PresetControlProps } from "./PresetControlProps";

const PresetControl = ({
    preset
}: PresetControlProps): ReactElement => {
    const { effectType, displayName } = preset;

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

    return (
        <div className="control-panel__visual-control">
            <span style={coloredText}>{displayName}</span>

            {effectType === et.Command && <>
                <PresetControlButton preset={preset} action={ea.Trigger} color="steel"/>
            </>}

            {effectType === et.Dragon && <>
                <PresetControlButton preset={preset} action={ea.Restart} color="orange"/>
            </>}

            {effectType === et.Laser && isGuardianLaser && <>
                <PresetControlButton preset={preset} action={ea.Trigger} color="indigo"/>
            </>}

            {effectType === et.Particle && <>
                <PresetControlButton preset={preset} action={ea.Trigger} color="orange"/>
            </>}

            {renderStartStop && <>
                <PresetControlButton preset={preset} action={ea.Start} color="green"/>
                <PresetControlButton preset={preset} action={ea.Stop} color="red"/>
            </>}
        </div>
    );
};

export default PresetControl;
