import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../RootState";
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
                accentColor={"cyan"}
                headerText={"Particle Effect Presets"}
            />
            <PresetManagerListGroup
                presets={dragonPresets}
                accentColor={"magenta"}
                headerText={"Dragon Effect Presets"}
            />
            <PresetManagerListGroup
                presets={laserPresets}
                accentColor={"indigo"}
                headerText={"Laser Effect Presets"}
            />
            <PresetManagerListGroup
                presets={potionPresets}
                accentColor={"green"}
                headerText={"Potion Effect Presets"}
            />
            <PresetManagerListGroup
                presets={timeshiftPresets}
                accentColor={"orange"}
                headerText={"Timeshift Effect Presets"}
            />
            <PresetManagerListGroup
                presets={commandPresets}
                accentColor={"steel"}
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
