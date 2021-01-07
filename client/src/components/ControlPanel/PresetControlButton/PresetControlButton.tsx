import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import * as ea from "../../../domain/EffectAction";
import * as et from "../../../domain/EffectType";
import { getShortcutString } from "../../../utils/utils";
import { runEffect } from "../ControlPanelActions";
import "./PresetControlButton.scss";
import { PresetControlButtonProps } from "./PresetControlButtonProps";

const PresetControlButton = ({
    preset,
    action,
    color,

    displayKeyBinding,
    secondsRunning,

    runEffect
}: PresetControlButtonProps): ReactElement => {
    const { effectType, keyBinding } = preset;

    const style = { borderColor: `var(--${color})`, color: `var(--${color})` };
    let icon: IconProp = ["fas", "chevron-down"];

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
        break;
    }

    const handleClick = () => runEffect(preset, action);

    return (
        <button className="control-panel-button" style={style} onClick={handleClick}>
            {displayKeyBinding && keyBinding
                ? <span>{getShortcutString(keyBinding)}</span>
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
