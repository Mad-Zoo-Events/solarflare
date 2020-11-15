import React from "react";
import PresetManagerListItem from "../PresetManagerListItem/PresetManagerListItem";
import "./PresetManagerListGroup.scss";
import { PresetManagerListGroupProps } from "./PresetManagerListGroupProps";
import Collapsible from "react-collapsible";

const PresetManagerListGroup = ({
    accentColor,
    headerText,
    presets
}: PresetManagerListGroupProps) => {
    const coloredBackground = { backgroundColor: `var(--${accentColor})` };
    const coloredBorder = { borderColor: `var(--${accentColor})` };
    const header = <div className="preset-manager-list-group__header" style={coloredBackground}>{headerText} ({presets.length})</div>;

    return (
        <Collapsible
            trigger={header}
            easing="ease-in-out"
        >
            <div className="preset-manager-list-group__container" style={{ ...coloredBorder }}>
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
