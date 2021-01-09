import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { toggleServer } from "../../../AppActions";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { RootState } from "../../../RootState";
import { selectDisplayMode } from "../ControlPanelActions";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import Submenu from "./Submenu/Submenu";

const HeaderControls = ({
    displayMode,
    servers,
    selectDisplayMode,
    toggleServer
}: HeaderControlsProps): ReactElement => {
    const displayModeOptions = Object.values(DisplayMode).map(key => ({
        value: key,
        text: key as DisplayMode,
        selected: displayMode === key
    }));

    const serverOptions = servers.map(({ id, name, isActive }) => ({
        value: id,
        text: name,
        selected: isActive
    }));

    return (
        <div className="control-panel__header-controls">
            <div className="separator"/>
            <Submenu
                label="Display Mode"
                iconProps={{ icon: ["fas", "eye"], size: "2x" }}
                options={displayModeOptions}
                onChange={(changed) => selectDisplayMode(changed.value as DisplayMode)}
            />
            <div className="separator"/>
            <Submenu
                label="Server Selection"
                iconProps={{ icon: ["fas", "satellite-dish"], size: "2x" }}
                options={serverOptions}
                multiselect
                onChange={(changed) => toggleServer({ id: changed.value, isActive: changed.selected, name: changed.text })}
            />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const displayMode = state.controlpanel.displayMode;
    const servers = state.app.servers;

    return {
        displayMode,
        servers
    };
}

const mapDispatchToProps = {
    selectDisplayMode: selectDisplayMode,
    toggleServer: toggleServer
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
