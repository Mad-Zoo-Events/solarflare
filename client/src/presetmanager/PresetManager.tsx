import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PresetManagerList from "../components/PresetManagerList";
import Routes from "../routes";
import { getAllPresets } from "./presetManagerActions";
import { PresetManagerProps } from "./presetManagerProps";
import { RootState } from "../RootState";

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
    console.log(state);
    const presets = state.presetmanager.presets;

    return {
        presets
    };
}

const mapDispatchToProps = {
    getPresets: getAllPresets
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager);
