import React, { useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../RootState";
import PageHeader from "./PageHeader/PageHeader";
import { fetchPresets } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";
import PresetModifier from "./PresetModifier/PresetModifier";

const PresetManager = ({
    getPresets,
    presetToEdit
}: PresetManagerProps) => {
    useEffect(getPresets, []);

    if (presetToEdit) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return (
        <>
            <PageHeader isControlPanel={false} />
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
