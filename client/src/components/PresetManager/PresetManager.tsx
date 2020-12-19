import React from "react";
import { connect } from "react-redux";
import { toast as doToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../../RootState";
import Page from "../Page/Page";
import { clearToast } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";
import PresetModifier from "./PresetModifier/PresetModifier";

const PresetManager = ({
    presetToEdit,
    toast,
    clearToast
}: PresetManagerProps) => {
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
        <Page isControlPanel={false}>
            <PresetManagerList />
            {presetToEdit && <PresetModifier />}
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const presets = state.app.presets;
    const presetToEdit = state.presetmanager.presetToEdit;
    const toast = state.presetmanager.toast;

    return {
        presets,
        presetToEdit,
        toast
    };
}

const mapDispatchToProps = {
    clearToast: clearToast
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetManager);
