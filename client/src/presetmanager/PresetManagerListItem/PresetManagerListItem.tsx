import React from "react";
import { getShortcut } from "../../utils/utils";
import "./PresetManagerListItem.scss";
import { PresetManagerListItemProps } from "./PresetManagerListProps";

const PresetManagerListItem = ({
    accentColor,
    preset
}: PresetManagerListItemProps) => {
    const coloredText = { color: `var(--${accentColor})` };
    const coloredBorder = { borderColor: `var(--${accentColor})` };

    if (preset) {
        const { id, displayName, description, keyBinding } = preset;

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
    }

    return (
        <div className="preset-manager-list-item__add-new" style={{ ...coloredBorder, ...coloredText }}>
            <div>+</div>
        </div>
    );
};

export default PresetManagerListItem;
