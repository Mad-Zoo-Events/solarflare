import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../RootState";
import PresetManagerListGroup from "../PresetManagerListGroup/PresetManagerListGroup";
import { PresetManagerListProps } from "./PresetManagerListProps";

const PresetManagerList = ({
    presets
}: PresetManagerListProps) => {
    const {
        particlePresets,
        dragonPresets,
        laserPresets,
        potionPresets,
        timeshiftPresets,
        commandPresets
    } = presets;

    return (
        <>
            <PresetManagerListGroup
                presets={particlePresets}
                effectType={"particle"}
                headerText={"Particle Effect Presets"}
            />
            <PresetManagerListGroup
                presets={dragonPresets}
                effectType={"dragon"}
                headerText={"Dragon Effect Presets"}
            />
            <PresetManagerListGroup
                presets={laserPresets}
                effectType={"laser"}
                headerText={"Laser Effect Presets"}
            />
            <PresetManagerListGroup
                presets={potionPresets}
                effectType={"potion"}
                headerText={"Potion Effect Presets"}
            />
            <PresetManagerListGroup
                presets={timeshiftPresets}
                effectType={"timeshift"}
                headerText={"Timeshift Effect Presets"}
            />
            <PresetManagerListGroup
                presets={commandPresets}
                effectType={"command"}
                headerText={"Command Presets"}
            />
        </>
    );
};

function mapStateToProps (state: RootState) {
    const presets = state.presetmanager.presets;

    return {
        presets
    };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManagerList);
