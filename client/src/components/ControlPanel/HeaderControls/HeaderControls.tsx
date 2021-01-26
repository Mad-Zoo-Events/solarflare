import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { chooseStage, toggleServer } from "../../../AppActions";
import { selectSelectedStage, selectServers, selectStages } from "../../../AppSelectors";
import { allEffectTypes, EffectType } from "../../../domain/EffectType";
import { RootState } from "../../../RootState";
import Routes from "../../../routes";
import Popup from "../../Popup/Popup";
import { chooseDisplayCategories } from "../ControlPanelActions";
import { selectCapsLockOn, selectDisplayCategories } from "../ControlPanelSelectors";
import BossbarControl from "./BossbarControl/BossbarControl";
import CommandControl from "./CommandControl/CommandControl";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import Select from "./Select/Select";
import { Option } from "./Select/SelectProps";

const HeaderControls = ({
    servers,
    stages,
    selectedStage,
    displayCategories,
    capsLockOn,
    chooseDisplayCategories,
    toggleServer,
    chooseStage
}: HeaderControlsProps) => {
    const displayModeOptions = allEffectTypes.map(effectType => ({
        value: effectType,
        text: effectType,
        selected: displayCategories.includes(effectType)
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

    const handleDisplayModeChange = (changed: Option, allSelected?: Option[]) => {
        if (!allSelected) {
            return;
        }
        chooseDisplayCategories(allSelected.map(option => option.value as EffectType));
    };

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
                    multiselect
                    onChange={handleDisplayModeChange}
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

    const displayCategories = selectDisplayCategories(state);
    const capsLockOn = selectCapsLockOn(state);

    return {
        servers,
        stages,
        selectedStage,
        displayCategories,
        capsLockOn
    };
}

const mapDispatchToProps = {
    chooseDisplayCategories: chooseDisplayCategories,
    toggleServer: toggleServer,
    chooseStage: chooseStage
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
