import React from "react";
import { getShortcut } from "../../utils/utils";
import "./PresetManagerListItem.css";
import { PresetManagerListItemProps } from "./PresetManagerListProps";

const PresetManagerListItem = ({
    accentColor,
    preset
}: PresetManagerListItemProps) => {
    const { id, displayName, description, keyBinding } = preset;
    const coloredText = { color: `var(--${accentColor})` };
    const coloredBorder = { borderColor: `var(--${accentColor})` };

    return (
        <div className="preset-manager-list-item__container" style={coloredBorder}>
            <div className="preset-manager-list-item__display-name" style={coloredText}>{displayName}</div>
            {
                description && <div className="preset-manager-list-item__description">{description}</div>
            }{
                keyBinding && <div className="preset-manager-list-item__shortcut code">{getShortcut(keyBinding)}</div>
            }
            <div className="preset-manager-list-item__id">{id}</div>
        </div>
    );
};

export default PresetManagerListItem;
