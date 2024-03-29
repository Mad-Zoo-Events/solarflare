import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import Collapsible from "react-collapsible";
import { getAccentColor, presetSorter } from "../../../utils/utils";
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
    const coloredTextShadow = { textShadow: `var(--${accentColor}-darker) 0px 0px 5px` };
    const coloredBorder = { borderColor: `var(--${accentColor})` };
    const coloredBackgroundAlpha = { backgroundColor: `var(--${accentColor}-alpha)` };

    const header = <>
        <div className="preset-manager-list-group__header" style={{ ...coloredBackground, ...coloredTextShadow }}>{headerText} ({presets.length})</div>
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
                { presets.sort(presetSorter).map(preset =>
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
