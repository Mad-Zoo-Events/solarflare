import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../RootState";
import Routes from "../routes";
import { fetchPresets } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";

const PresetManager = ({
    presets,
    getPresets
}: PresetManagerProps) => {
    useEffect(getPresets, []);

    return (
        <>
            <PresetManagerList presets={presets} />
            <Link to={Routes.controlPanel}>Back</Link>
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
    getPresets: fetchPresets
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager);
