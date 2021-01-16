import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { chooseStage, toggleServer } from "../../../AppActions";
import { selectSelectedStage, selectServers, selectStages } from "../../../AppSelectors";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { RootState } from "../../../RootState";
import { chooseDisplayMode } from "../ControlPanelActions";
import { selectDisplayMode } from "../ControlPanelSelectors";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import Submenu from "./Submenu/Submenu";
import BossbarControl from "./BossbarControl/BossbarControl";

const HeaderControls = ({
    servers,
    stages,
    selectedStage,
    displayMode,
    chooseDisplayMode,
    toggleServer,
    chooseStage
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
            <BossbarControl/>
            <div className="separator"/>
            <Submenu
                label="Display Mode"
                iconProps={{ icon: ["fas", "eye"], size: "2x" }}
                options={displayModeOptions}
                onChange={(changed) => chooseDisplayMode(changed.value as DisplayMode)}
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
                onChange={(changed) => chooseStage(changed.value)}
            />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const servers = selectServers(state);
    const stages = selectStages(state);
    const selectedStage = selectSelectedStage(state);

    const displayMode = selectDisplayMode(state);

    return {
        servers,
        stages,
        selectedStage,
        displayMode
    };
}

const mapDispatchToProps = {
    chooseDisplayMode: chooseDisplayMode,
    toggleServer: toggleServer,
    chooseStage: chooseStage
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
