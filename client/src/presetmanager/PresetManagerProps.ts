import { HandleThunkActionCreator } from "react-redux";
import { TypeOptions } from "react-toastify";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";
import { fetchPresets } from "./PresetManagerActions";

export interface PresetManagerProps {
    presets: PresetCollection
    presetToEdit?: {effectType: string, preset: Preset}
    toast?: {message: string, type: TypeOptions, id: string}

    getPresets: HandleThunkActionCreator<typeof fetchPresets>
    clearToast: () => void
}
