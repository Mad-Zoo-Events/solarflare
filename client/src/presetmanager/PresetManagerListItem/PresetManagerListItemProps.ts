import { HandleThunkActionCreator } from "react-redux";
import { Preset } from "../../domain/presets/Preset";
import { duplicatePreset } from "../PresetManagerActions";

export interface PresetManagerListItemProps {
    preset?: Preset
    effectType: string

    onDuplicate: HandleThunkActionCreator<typeof duplicatePreset>
}
