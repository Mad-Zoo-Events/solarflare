import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { chooseStage, toggleServer } from "../../../AppActions";
import { selectSelectedStage, selectServers, selectStages } from "../../../AppSelectors";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { RootState } from "../../../RootState";
import Routes from "../../../routes";
import Popup from "../../Popup/Popup";
import { chooseDisplayMode } from "../ControlPanelActions";
import { selectCapsLockOn, selectDisplayMode } from "../ControlPanelSelectors";
import BossbarControl from "./BossbarControl/BossbarControl";
import CommandControl from "./CommandControl/CommandControl";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import Select from "./Select/Select";

const HeaderControls = ({
    servers,
    stages,
    selectedStage,
    displayMode,
    capsLockOn,
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
            <div className="bossbar-control">
                <BossbarControl/>
            </div>
            <div className="separator first-separator"/>
            <Popup label="Run Command" iconProps={{ icon: ["fas", "terminal"], size: "2x" }}>
                <CommandControl/>
            </Popup>
            <div className="separator"/>
            <Popup label="Display Mode" iconProps={{ icon: ["fas", "eye"], size: "2x" }}>
                <Select
                    options={displayModeOptions}
                    onChange={(changed) => chooseDisplayMode(changed.value as DisplayMode)}
                />
            </Popup>
            <div className="separator"/>
            <Popup label="Server Selection" iconProps={{ icon: ["fas", "satellite-dish"], size: "2x" }}>
                <Select
                    options={serverOptions}
                    multiselect
                    onChange={(changed) => toggleServer({ id: changed.value, isActive: changed.selected, name: changed.text })}
                />
            </Popup>
            <div className="separator"/>
            <Popup label="Stage Selection" iconProps={{ icon: ["fas", "globe-asia"], size: "2x" }}>
                <Select
                    options={stageOptions}
                    onChange={(changed) => chooseStage(changed.value)}
                />
            </Popup>
            <div className="separator"/>
            <Link className="button header-button" to={Routes.presetManager}>
                <FontAwesomeIcon icon={["fas", "cogs"]} size="2x" />
                <div>Preset Manager</div>
            </Link>
            {capsLockOn &&
                <div className="capslock-warning">
                    Warning: CAPS lock is on!
                </div>
            }
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const servers = selectServers(state);
    const stages = selectStages(state);
    const selectedStage = selectSelectedStage(state);

    const displayMode = selectDisplayMode(state);
    const capsLockOn = selectCapsLockOn(state);

    return {
        servers,
        stages,
        selectedStage,
        displayMode,
        capsLockOn
    };
}

const mapDispatchToProps = {
    chooseDisplayMode: chooseDisplayMode,
    toggleServer: toggleServer,
    chooseStage: chooseStage
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
