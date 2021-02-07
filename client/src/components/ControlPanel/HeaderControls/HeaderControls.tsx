import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { chooseStage } from "../../../AppActions";
import { selectSelectedStage, selectStages } from "../../../AppSelectors";
import { DefaultLayout } from "../../../domain/controlpanel/DefaultLayout";
import { allEffectTypes, EffectType } from "../../../domain/EffectType";
import { RootState } from "../../../RootState";
import Routes from "../../../routes";
import Popup from "../../Popup/Popup";
import { changeLayout, chooseDisplayCategories } from "../ControlPanelActions";
import { selectCapsLockOn, selectDisplayCategories } from "../ControlPanelSelectors";
import BossbarControl from "./BossbarControl/BossbarControl";
import CommandControl from "./CommandControl/CommandControl";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";
import InstanceSettings from "./InstanceSettings/InstanceSettings";
import Select from "./Select/Select";
import { Option } from "./Select/SelectProps";

const HeaderControls = ({
    stages,
    selectedStage,
    displayCategories,
    capsLockOn,
    chooseDisplayCategories,
    changeLayout,
    chooseStage
}: HeaderControlsProps) => {
    const displayModeOptions = allEffectTypes.map(effectType => ({
        value: effectType,
        text: effectType,
        selected: displayCategories.includes(effectType)
    }));

    const stageOptions = stages.map(stage => ({
        value: stage,
        text: stage.toUpperCase(),
        selected: stage === selectedStage
    }));

    const handleDisplayModeChange = (_changed: Option, allSelected?: Option[]) => {
        if (!allSelected) {
            return;
        }
        chooseDisplayCategories(allSelected.map(option => option.value as EffectType));
    };

    const handleDefaultLayout = () => changeLayout(DefaultLayout);

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
            <Popup label="Display Options" iconProps={{ icon: ["fas", "eye"], size: "2x" }}>
                <Select
                    options={displayModeOptions}
                    multiselect
                    onChange={handleDisplayModeChange}
                />
                <div className="button default-layout-button" onClick={handleDefaultLayout}>
                    Restore Default Layout
                </div>
            </Popup>
            <div className="separator"/>
            <Popup label="Manage Servers" iconProps={{ icon: ["fas", "satellite-dish"], size: "2x" }}>
                <InstanceSettings />
            </Popup>
            <div className="separator"/>
            <Popup label="Switch Stage" iconProps={{ icon: ["fas", "globe-asia"], size: "2x" }}>
                <Select
                    options={stageOptions}
                    onChange={(changed) => chooseStage(changed.value)}
                />
            </Popup>
            <div className="separator"/>
            <Link className="button header-button" to={Routes.presetManager}>
                <FontAwesomeIcon icon={["fas", "cogs"]} size="2x" />
                <div>Manage Presets</div>
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
    const stages = selectStages(state);
    const selectedStage = selectSelectedStage(state);

    const displayCategories = selectDisplayCategories(state);
    const capsLockOn = selectCapsLockOn(state);

    return {
        stages,
        selectedStage,
        displayCategories,
        capsLockOn
    };
}

const mapDispatchToProps = {
    chooseDisplayCategories: chooseDisplayCategories,
    chooseStage: chooseStage,
    changeLayout: changeLayout
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
