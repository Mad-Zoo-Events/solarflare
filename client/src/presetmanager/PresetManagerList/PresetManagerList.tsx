import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../RootState";
import PresetManagerListItem from "../PresetManagerListItem/PresetManagerListItem";
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
            {commandPresets.map(preset => <PresetManagerListItem key={preset.id} preset={preset} />)}
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
