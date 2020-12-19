import { PresetManagerState } from "./components/PresetManager/PresetManagerState";
import { AppState } from "./AppState";

export interface RootState {
    presetmanager: PresetManagerState
    app: AppState
}
