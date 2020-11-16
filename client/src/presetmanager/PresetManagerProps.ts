import { HandleThunkActionCreator } from "react-redux";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";
import { fetchPresets } from "./PresetManagerActions";

export interface PresetManagerProps {
    presets: PresetCollection
    presetToEdit?: {effectType: string, preset: Preset}

    getPresets: HandleThunkActionCreator<typeof fetchPresets>
}
