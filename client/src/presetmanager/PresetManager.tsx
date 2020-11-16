import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Preset } from "../domain/presets/Preset";
import { RootState } from "../RootState";
import Routes from "../routes";
import { fetchPresets } from "./PresetManagerActions";
import PresetManagerList from "./PresetManagerList/PresetManagerList";
import { PresetManagerProps } from "./PresetManagerProps";
import * as et from "../domain/EffectType";
import { CommandPreset } from "../domain/presets";
import CommandPresetModifier from "./PresetModifier/CommandPresetModifier";

const PresetManager = ({
    getPresets,
    presetToEdit
}: PresetManagerProps) => {
    useEffect(getPresets, []);

    const openPresetModifier = (effectType: string, preset: Preset) => {
        switch (effectType) {
        case et.Command:
            preset = preset as CommandPreset || { id: "", displayName: "", commands: [""] };
            return <CommandPresetModifier preset={preset} />;
        case et.Dragon:
            preset = preset as CommandPreset || { id: "", displayName: "", commands: [""] };
            return <CommandPresetModifier preset={preset} />;
        case et.Laser:
            preset = preset as CommandPreset || { id: "", displayName: "", commands: [""] };
            return <CommandPresetModifier preset={preset} />;
        case et.Particle:
            preset = preset as CommandPreset || { id: "", displayName: "", commands: [""] };
            return <CommandPresetModifier preset={preset} />;
        case et.Potion:
            preset = preset as CommandPreset || { id: "", displayName: "", commands: [""] };
            return <CommandPresetModifier preset={preset} />;
        case et.Timeshift:
            preset = preset as CommandPreset || { id: "", displayName: "", commands: [""] };
            return <CommandPresetModifier preset={preset} />;
        }
    };

    return (
        <>
            <Link to={Routes.controlPanel}>Back</Link>
            <PresetManagerList />
            {presetToEdit && openPresetModifier(presetToEdit.effectType, presetToEdit.preset)}
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
