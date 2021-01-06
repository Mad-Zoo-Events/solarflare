import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import * as ea from "../../../domain/EffectAction";
import * as et from "../../../domain/EffectType";
import { RootState } from "../../../RootState";
import { getShortcutString } from "../../../utils/utils";
import { runEffect } from "../ControlPanelActions";
import "./PresetControlButton.scss";
import { PresetControlButtonProps } from "./PresetControlButtonProps";

const PresetControlButton = ({
    preset,
    action,
    color,
    runningEffects,
    runEffect
}: PresetControlButtonProps): ReactElement => {
    const { id, effectType, keyBinding } = preset;

    let displayCounter;
    let displayKeyBinding;

    const style = { borderColor: `var(--${color})`, color: `var(--${color})` };
    let icon: IconProp = ["fas", "chevron-down"];

    const counter = runningEffects.find(e => e.preset.id === id)?.counter;

    switch (action) {
    case ea.Trigger:
        if (effectType === et.Laser) {
            icon = ["fas", "palette"];
        } else {
            icon = ["fas", "step-forward"];
        }
        if (effectType === et.Command) {
            displayKeyBinding = true;
        }
        break;
    case ea.Restart:
        icon = ["fas", "sync"];
        break;
    case ea.Start:
        icon = ["fas", "play"];
        displayKeyBinding = true;
        break;
    case ea.Stop:
        icon = ["fas", "stop"];
        displayCounter = true;
        break;
    default:
        break;
    }

    const handleClick = () => runEffect(preset, action);

    return (
        <button className="control-panel-button" style={style} onClick={handleClick}>
            {displayKeyBinding && keyBinding
                ? <span>{getShortcutString(keyBinding)}</span>
                : displayCounter && counter
                    ? <div>{counter}</div>
                    : <FontAwesomeIcon icon={icon} size="sm" />
            }
        </button>
    );
};

function mapStateToProps (state: RootState) {
    const runningEffects = state.controlpanel.runningEffects;

    return {
        runningEffects
    };
}

const mapDispatchToProps = {
    runEffect: runEffect
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetControlButton);
