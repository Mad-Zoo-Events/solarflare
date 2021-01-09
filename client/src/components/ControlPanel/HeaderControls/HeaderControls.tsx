import React, { ReactElement } from "react";
import { connect } from "react-redux";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { RootState } from "../../../RootState";
import { selectDisplayMode } from "../ControlPanelActions";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import Submenu from "./Submenu/Submenu";

const HeaderControls = ({
    displayMode,
    selectDisplayMode
}: HeaderControlsProps): ReactElement => {
    const displayOptions = Object.keys(DisplayMode).map(key => ({
        value: key,
        text: key as DisplayMode,
        selected: displayMode === key
    }));
    console.log(displayOptions);

    return (
        <div className="control-panel__header-controls">
            <div className="separator"/>
            <Submenu
                label="Display Options"
                iconProps={{ icon: ["fas", "eye"], size: "2x" }}
                options={displayOptions}
                onChange={(selected) => selectDisplayMode(selected[0] as DisplayMode)}
            />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const displayMode = state.controlpanel.displayMode;

    return {
        displayMode
    };
}

const mapDispatchToProps = {
    selectDisplayMode: selectDisplayMode
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
