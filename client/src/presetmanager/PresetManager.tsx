import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PresetManagerList from "../components/PresetManagerList";
import { RootState } from "../RootState";
import Routes from "../routes";
import { fetchAllPresets } from "./presetManagerActions";
import { PresetManagerProps } from "./presetManagerProps";

const PresetManager = ({
    presets,
    getPresets
}: PresetManagerProps) => {
    return (
        <>
            <PresetManagerList />
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
