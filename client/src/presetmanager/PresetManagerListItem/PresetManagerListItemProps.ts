import { HandleThunkActionCreator } from "react-redux";
import { Preset } from "../../domain/presets/Preset";
import { deletePreset, duplicatePreset } from "../PresetManagerActions";

export interface PresetManagerListItemProps {
    preset?: Preset
    effectType: string

    onDuplicate: HandleThunkActionCreator<typeof duplicatePreset>
    onDelete: HandleThunkActionCreator<typeof deletePreset>
}
