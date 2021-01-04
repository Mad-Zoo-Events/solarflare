import React, { ReactElement } from "react";
import "./PresetControlButton.scss";
import { PresetControlButtonProps } from "./PresetControlButtonProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const PresetControlButton = ({
    action,
    color
}: PresetControlButtonProps): ReactElement => {
    const style = { borderColor: `var(--${color})`, color: `var(--${color})` };
    let icon: IconProp = ["fas", "chevron-down"];

    switch (action) {
    case "trigger":
        icon = ["fas", "step-forward"];
        break;
    case "color":
        icon = ["fas", "palette"];
        break;
    case "restart":
        icon = ["fas", "sync"];
        break;
    case "start":
        icon = ["fas", "play"];
        break;
    case "stop":
        icon = ["fas", "stop"];
        break;
    default:
        break;
    }

    return (
        <button className="control-panel-button" style={style}>
            <FontAwesomeIcon icon={icon} size="sm" />
        </button>
    );
};

export default PresetControlButton;
