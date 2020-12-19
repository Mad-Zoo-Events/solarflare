import React, { useEffect } from "react";
import { connect } from "react-redux";
import { toast as doToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../../RootState";
import Page from "../Page/Page";
import { clearToast, fetchPresets } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";
import PresetModifier from "./PresetModifier/PresetModifier";

const PresetManager = ({
    getPresets,
    presetToEdit,
    toast,
    clearToast
}: PresetManagerProps) => {
    useEffect(getPresets, []);

    if (presetToEdit) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    if (toast) {
        const { message, type, id } = toast;
        doToast(message, { type, toastId: id });
        clearToast();
    }

    return (
        <Page isControlPanel={false} version="0">
            <PresetManagerList />
            {presetToEdit && <PresetModifier />}
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const presets = state.presetmanager.presets;
    const presetToEdit = state.presetmanager.presetToEdit;
    const toast = state.presetmanager.toast;

    return {
        presets,
        presetToEdit,
        toast
    };
}

const mapDispatchToProps = {
    getPresets: fetchPresets,
    clearToast: clearToast
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager);
