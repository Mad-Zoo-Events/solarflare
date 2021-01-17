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

    isRunning,
    denyClick,
    displayKeyBinding,
    secondsRunning,

    runEffect
}: PresetControlButtonProps): ReactElement => {
    const { effectType, keyBindingStr } = preset;

    let icon: IconProp;
    const style = {
        borderColor: `var(--${color})`,
        color: isRunning
            ? "var(--background)"
            : secondsRunning !== undefined
                ? "var(--lighter-accent)"
                : `var(--${color})`,
        backgroundColor: isRunning ? `var(--${color})` : "var(--darker-gray)"
    };
    const className = `button control-panel-button code${isRunning ? " running" : ""}${denyClick ? " forbidden" : ""}`;

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
