import { HandleThunkActionCreator } from "react-redux";
import { PresetCollection } from "../domain/PresetCollection";
import { fetchPresets } from "./PresetManagerActions";

export interface PresetManagerProps {
    presets: PresetCollection

    getPresets: HandleThunkActionCreator<typeof fetchPresets>
}
