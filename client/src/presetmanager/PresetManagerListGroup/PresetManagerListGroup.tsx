import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Collapsible from "react-collapsible";
import PresetManagerListItem from "../PresetManagerListItem/PresetManagerListItem";
import "./PresetManagerListGroup.scss";
import { PresetManagerListGroupProps } from "./PresetManagerListGroupProps";

const PresetManagerListGroup = ({
    accentColor,
    headerText,
    presets
}: PresetManagerListGroupProps) => {
    const coloredBackground = { backgroundColor: `var(--${accentColor})` };
    const coloredBorder = { borderColor: `var(--${accentColor})` };
    const coloredBackgroundAlpha = { backgroundColor: `var(--${accentColor}-alpha)` };

    const header = <>
        <div className="preset-manager-list-group__header" style={coloredBackground}>{headerText} ({presets.length})</div>
        <div className="preset-manager-list-group__header-chevron">
            <FontAwesomeIcon icon={["fas", "chevron-down"]} size="sm" />
        </div>
    </>;

    return (
        <Collapsible trigger={header} easing="ease-in-out">
            <div className="preset-manager-list-group__container" style={{ ...coloredBorder, ...coloredBackgroundAlpha }}>
                <PresetManagerListItem
                    key="new"
                    accentColor={accentColor} />
                { presets.map(preset =>
                    <PresetManagerListItem
                        key={preset.id}
                        preset={preset}
                        accentColor={accentColor} />
                )}
            </div>
        </Collapsible>
    );
};

export default PresetManagerListGroup;
