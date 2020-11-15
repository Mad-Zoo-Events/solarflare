import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../RootState";
import Routes from "../routes";
import { fetchAllPresets } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";

const PresetManager = ({
    presets,
    getPresets
}: PresetManagerProps) => {
    return (
        <>
            <PresetManagerList presets={presets} />
            <Link to={Routes.controlPanel}>Back</Link>
            <button onClick={getPresets}>Get Presets</button>
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
    getPresets: fetchAllPresets
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager);
