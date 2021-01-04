import React, { ReactElement } from "react";
import { getAccentColor } from "../../../utils/utils";
import PresetControlButton from "../PresetControlButton/PresetControlButton";
import "./PresetControl.scss";
import { PresetControlProps } from "./PresetControlProps";

const PresetControl = ({
    effectType,
    dispalyName,
    isGuardianLaser
}: PresetControlProps): ReactElement => {
    const renderStartStop =
    effectType === "dragon" ||
    effectType === "laser" ||
    effectType === "particle" ||
    effectType === "potion" ||
    effectType === "timeshift";

    const color = getAccentColor(effectType);
    const coloredText = { borderColor: `var(--${color})`, color: `var(--${color})` };

    return (
        <div className="control-panel__visual-control">
            <span style={coloredText}>{dispalyName}</span>

            {effectType === "command" && <>
                <PresetControlButton action="trigger" color="steel"/>
            </>}

            {effectType === "dragon" && <>
                <PresetControlButton action="restart" color="orange"/>
            </>}

            {effectType === "laser" && isGuardianLaser && <>
                <PresetControlButton action="color" color="indigo"/>
            </>}

            {effectType === "particle" && <>
                <PresetControlButton action="trigger" color="orange"/>
            </>}

            {renderStartStop && <>
                <PresetControlButton action="start" color="green"/>
                <PresetControlButton action="stop" color="red"/>
            </>}
        </div>
    );
};

export default PresetControl;
