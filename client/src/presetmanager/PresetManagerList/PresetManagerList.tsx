import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../RootState";
import PresetManagerListGroup from "../PresetManagerListGroup/PresetManagerListGroup";
import { PresetManagerListProps } from "./PresetManagerListProps";

const PresetManagerList = ({
    presets
}: PresetManagerListProps) => {
    const {
        commandPresets
        // dragonPresets,
        // laserPresets,
        // particlePresets,
        // potionPreset,
        // timeshiftPreset
    } = presets;

    return (
        <>
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
