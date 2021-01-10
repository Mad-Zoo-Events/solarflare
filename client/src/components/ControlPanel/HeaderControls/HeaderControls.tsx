import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { selectStage, toggleServer } from "../../../AppActions";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { RootState } from "../../../RootState";
import { selectDisplayMode } from "../ControlPanelActions";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import Submenu from "./Subment/Submenu";

const HeaderControls = ({
    servers,
    stages,
    selectedStage,
    displayMode,
    selectDisplayMode,
    toggleServer,
    selectStage
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

    const stageOptions = stages.map(stage => ({
        value: stage,
        text: stage.toUpperCase(),
        selected: stage === selectedStage
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
            <div className="separator"/>
            <Submenu
                label="Stage Selection"
                iconProps={{ icon: ["fas", "globe-asia"], size: "2x" }}
                options={stageOptions}
                onChange={(changed) => selectStage(changed.value)}
            />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const { servers, stages, selectedStage } = state.app;
    const { displayMode } = state.controlpanel;

    return {
        servers,
        stages,
        selectedStage,
        displayMode
    };
}

const mapDispatchToProps = {
    selectDisplayMode: selectDisplayMode,
    toggleServer: toggleServer,
    selectStage: selectStage
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
