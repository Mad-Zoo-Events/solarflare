import { HandleThunkActionCreator } from "react-redux";
import { Preset } from "../../../domain/presets/Preset";
import { deletePreset, duplicatePreset, editPreset } from "../PresetManagerActions";

export interface PresetManagerListItemProps {
    preset?: Preset
    effectType: string

    onDuplicate: HandleThunkActionCreator<typeof duplicatePreset>
    onDelete: HandleThunkActionCreator<typeof deletePreset>
    onEdit: HandleThunkActionCreator<typeof editPreset>
}
