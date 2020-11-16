import { HandleThunkActionCreator } from "react-redux";
import { Preset } from "../../domain/presets/Preset";
import { shouldClosePresetModifier } from "../PresetManagerActions";

export interface PresetModifierProps {
    preset: Preset
    effectType: string

    onClose: HandleThunkActionCreator<typeof shouldClosePresetModifier>
}
