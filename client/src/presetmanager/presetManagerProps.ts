import { PresetCollection } from "../domain/PresetCollection";
import { HandleThunkActionCreator } from "react-redux";
import { getAllPresets } from "./presetManagerActions";

export interface PresetManagerProps {
    presets: PresetCollection

    getPresets: HandleThunkActionCreator<typeof getAllPresets>
}
