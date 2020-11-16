import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { getAccentColor, getShortcut } from "../../utils/utils";
import { deletePreset, duplicatePreset, editPreset } from "../PresetManagerActions";
import "./PresetManagerListItem.scss";
import { PresetManagerListItemProps } from "./PresetManagerListItemProps";

const PresetManagerListItem = ({
    effectType,
    preset,
    onDuplicate,
    onDelete,
    onEdit
}: PresetManagerListItemProps) => {
    const accentColor = getAccentColor(effectType);
    const coloredText = { color: `var(--${accentColor})` };

    if (preset) {
        const { id, displayName, description, keyBinding } = preset;
        const coloredBorder = { borderColor: `var(--${accentColor})` };
        const confirmDelete = (id: string, effectType: string) => {
            window.confirm("Are you sure you wish to delete this preset?") && onDelete(id, effectType);
        };

        return (
            <div className="preset-manager-list-item__container" style={coloredBorder}>
                <div className="preset-manager-list-item__display-name" style={coloredText}>{displayName}</div>
                {
                    description && <div className="preset-manager-list-item__description">{description}</div>
                }{
                    keyBinding && <div className="preset-manager-list-item__shortcut code">{getShortcut(keyBinding)}</div>
                }
                <div className="preset-manager-list-item__id">{id}</div>
                <div className="preset-manager-list-item__actions">
                    <FontAwesomeIcon icon={["far", "edit"]} size="lg" style={coloredText} onClick={() => onEdit(effectType, preset)}/>
                    <FontAwesomeIcon icon={["far", "clone"]} size="lg" onClick={() => onDuplicate(id, effectType)} />
                    <FontAwesomeIcon icon={["far", "trash-alt"]} size="lg" onClick={() => confirmDelete(id, effectType)} />
                </div>
            </div>
        );
    }

    return (
        <div className="preset-manager-list-item__add-new" style={coloredText} onClick={() => onEdit(effectType, preset)}>
            <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" />
        </div>
    );
};

const mapDispatchToProps = {
    onDuplicate: duplicatePreset,
    onDelete: deletePreset,
    onEdit: editPreset
};

export default connect(null, mapDispatchToProps)(PresetManagerListItem);
