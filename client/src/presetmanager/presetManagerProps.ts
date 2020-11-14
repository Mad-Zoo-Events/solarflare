import { HandleThunkActionCreator } from "react-redux";
import { PresetCollection } from "../domain/PresetCollection";
import { fetchAllPresets } from "./presetManagerActions";

export interface PresetManagerProps {
    presets: PresetCollection

    getPresets: HandleThunkActionCreator<typeof fetchAllPresets>
}
