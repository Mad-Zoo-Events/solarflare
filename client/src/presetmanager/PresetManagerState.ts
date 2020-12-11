import { TypeOptions } from "react-toastify";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";

export interface PresetManagerState {
    presets: PresetCollection
    presetToEdit?: {effectType: string, preset: Preset}
    toast?: {message: string, type: TypeOptions, id: string}
}
