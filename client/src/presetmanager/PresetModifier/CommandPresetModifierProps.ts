import { HandleThunkActionCreator } from "react-redux";
import { CommandPreset } from "../../domain/presets";
import { shouldClosePresetModifier } from "../PresetManagerActions";

export interface CommandPresetModifierProps {
    preset: CommandPreset
    onClose: HandleThunkActionCreator<typeof shouldClosePresetModifier>
}
