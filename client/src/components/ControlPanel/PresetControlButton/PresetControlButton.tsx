import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import * as ea from "../../../domain/EffectAction";
import * as et from "../../../domain/EffectType";
import { runEffect } from "../ControlPanelActions";
import "./PresetControlButton.scss";
import { PresetControlButtonProps } from "./PresetControlButtonProps";

const PresetControlButton = ({
    preset,
    action,
    color,

    isRunning: isRunningStartButton,
    denyClick,
    displayKeyBinding,
    secondsRunning,

    runEffect
}: PresetControlButtonProps): ReactElement => {
    const { effectType, keyBindingStr } = preset;

    const isRunningStopButton = secondsRunning !== undefined && !denyClick;

    let icon: IconProp;
    const style = {
        borderColor: `var(--${color})`,
        color: isRunningStartButton || isRunningStopButton
            ? "var(--background)"
            : `var(--${color})`,
        backgroundColor: isRunningStartButton || isRunningStopButton ? `var(--${color})` : "var(--darkest-gray)"
    };
    const className = `button control-panel-button code ${isRunningStartButton ? "running-start" : isRunningStopButton ? "running-stop" : ""} ${denyClick ? "forbidden" : ""}`;

    switch (action) {
    case ea.Trigger:
        if (effectType === et.Laser) {
            icon = ["fas", "palette"];
        } else {
            icon = ["fas", "step-forward"];
        }
        break;
    case ea.Restart:
        icon = ["fas", "sync"];
        break;
    case ea.Start:
        icon = ["fas", "play"];
        break;
    case ea.Stop:
        icon = ["fas", "stop"];
        break;
    default:
        icon = ["fas", "question"];
        break;
    }

    const handleClick = () => !denyClick && runEffect(preset, action);

    return (
        <button
            className={className}
            style={style}
            onClick={handleClick}
        >

            {displayKeyBinding && keyBindingStr
                ? <span>{keyBindingStr}</span>
                : secondsRunning !== undefined
                    ? <div>{secondsRunning}</div>
                    : <FontAwesomeIcon icon={icon} size="sm" />
            }
        </button>
    );
};

const mapDispatchToProps = {
    runEffect: runEffect
};

export default connect(null, mapDispatchToProps)(PresetControlButton);
