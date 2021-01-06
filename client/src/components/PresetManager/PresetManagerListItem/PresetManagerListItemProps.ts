import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";
import { deletePreset, duplicatePreset, editPreset } from "../PresetManagerActions";

export interface PresetManagerListItemProps {
    preset?: Preset
    effectType: EffectType

    onDuplicate: HandleThunkActionCreator<typeof duplicatePreset>
    onDelete: HandleThunkActionCreator<typeof deletePreset>
    onEdit: HandleThunkActionCreator<typeof editPreset>
}
