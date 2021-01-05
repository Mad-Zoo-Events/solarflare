import { AppState } from "./AppState";
import { ControlPanelState } from "./components/ControlPanel/ControlPanelState";
import { PresetManagerState } from "./components/PresetManager/PresetManagerState";

export interface RootState {
    presetmanager: PresetManagerState
    controlpanel: ControlPanelState
    app: AppState
}
