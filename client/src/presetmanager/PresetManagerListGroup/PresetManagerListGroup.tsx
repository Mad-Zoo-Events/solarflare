import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import Collapsible from "react-collapsible";
import { getAccentColor } from "../../utils/utils";
import PresetManagerListItem from "../PresetManagerListItem/PresetManagerListItem";
import "./PresetManagerListGroup.scss";
import { PresetManagerListGroupProps } from "./PresetManagerListGroupProps";

const PresetManagerListGroup = ({
    effectType,
    headerText,
    presets
}: PresetManagerListGroupProps): ReactElement => {
    const accentColor = getAccentColor(effectType);
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
                    effectType={effectType} />
                { presets.map(preset =>
                    <PresetManagerListItem
                        key={preset.id}
                        preset={preset}
                        effectType={effectType} />
                )}
            </div>
        </Collapsible>
    );
};

export default PresetManagerListGroup;
