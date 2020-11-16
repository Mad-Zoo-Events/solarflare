import { HandleThunkActionCreator } from "react-redux";
import { Preset } from "../../domain/presets/Preset";
import { closePresetModifier } from "../PresetManagerActions";

export interface PresetModifierProps {
    preset: Preset
    effectType: string

    onClose: HandleThunkActionCreator<typeof closePresetModifier>
}
