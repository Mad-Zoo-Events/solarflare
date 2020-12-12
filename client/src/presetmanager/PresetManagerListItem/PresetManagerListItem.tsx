import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { getAccentColor, getShortcutString, getSummary } from "../../utils/utils";
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
    const coloredText = { color: `var(--lighter-${accentColor})` };

    if (preset) {
        const { id, displayName, description, keyBinding } = preset;
        const coloredBorder = { borderColor: `var(--${accentColor})` };
        const confirmDelete = (id: string, effectType: string) => {
            window.confirm("Are you sure you wish to delete this preset?") && onDelete(id, effectType);
        };

        return (
            <div className="preset-manager-list-item__container" style={coloredBorder}>
                <div className="edit-preset" style={coloredText} onClick={() => onEdit(effectType, preset)} title="Edit This Preset" >
                    <FontAwesomeIcon icon={["far", "edit"]} size="lg" />
                </div>

                <div className="display-name" style={coloredText}>
                    {displayName}
                </div>

                {keyBinding !== 0 &&
                <div className="shortcut" title="Keyboard Shortcut">
                    <code>{getShortcutString(keyBinding)}</code>
                </div>
                }

                <div className="summary" style={coloredText} title="Summary">
                    {getSummary(preset, effectType)}
                </div>

                { description &&
                <div className="description" style={coloredText} title="Description">
                    <FontAwesomeIcon icon={["fas", "quote-left"]} size="xs" />
                    <span>{description}</span>
                    <FontAwesomeIcon icon={["fas", "quote-right"]} size="xs" />
                </div>
                }

                <div className="id" title="Unique Identifier (UUID) of This Preset">{id}</div>

                <div className="actions">
                    <FontAwesomeIcon className="duplicate-preset" icon={["far", "clone"]} size="lg" onClick={() => onDuplicate(id, effectType)} title="Duplicate This Preset" />
                    <FontAwesomeIcon className="delete-preset" icon={["far", "trash-alt"]} size="lg" onClick={() => confirmDelete(id, effectType)} title="Delete This Preset" />
                </div>
            </div>
        );
    }

    return (
        <div className="preset-manager-list-item__add-new" style={coloredText} onClick={() => onEdit(effectType, preset)}>
            <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" title="Add A New Preset" />
        </div>
    );
};

const mapDispatchToProps = {
    onDuplicate: duplicatePreset,
    onDelete: deletePreset,
    onEdit: editPreset
};

export default connect(null, mapDispatchToProps)(PresetManagerListItem);
