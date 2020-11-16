import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../RootState";
import Routes from "../routes";
import { fetchPresets } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";
import PresetModifier from "./PresetModifier/PresetModifier";

const PresetManager = ({
    getPresets,
    presetToEdit
}: PresetManagerProps) => {
    useEffect(getPresets, []);

    return (
        <>
            <Link to={Routes.controlPanel}>Back</Link>
            <PresetManagerList />
            {presetToEdit && <PresetModifier />}
        </>
    );
};

function mapStateToProps (state: RootState) {
    const presets = state.presetmanager.presets;
    const presetToEdit = state.presetmanager.presetToEdit;

    return {
        presets,
        presetToEdit
    };
}

const mapDispatchToProps = {
    getPresets: fetchPresets
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager);
