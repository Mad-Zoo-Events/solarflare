import React from "react";
import { connect } from "react-redux";
import * as et from "../../../domain/EffectType";
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
                effectType={et.Particle}
                headerText={"Particle Effect Presets"}
            />
            <PresetManagerListGroup
                presets={dragonPresets}
                effectType={et.Dragon}
                headerText={"Dragon Effect Presets"}
            />
            <PresetManagerListGroup
                presets={laserPresets}
                effectType={et.Laser}
                headerText={"Laser Effect Presets"}
            />
            <PresetManagerListGroup
                presets={potionPresets}
                effectType={et.Potion}
                headerText={"Potion Effect Presets"}
            />
            <PresetManagerListGroup
                presets={timeshiftPresets}
                effectType={et.Timeshift}
                headerText={"Timeshift Effect Presets"}
            />
            <PresetManagerListGroup
                presets={commandPresets}
                effectType={et.Command}
                headerText={"Command Presets"}
            />
        </>
    );
};

function mapStateToProps (state: RootState) {
    const { presets } = state.app;

    return {
        presets
    };
}

export default connect(mapStateToProps, {})(PresetManagerList);
