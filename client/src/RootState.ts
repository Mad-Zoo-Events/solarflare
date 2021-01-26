import { AppState } from "./AppState";
import { ControlPanelState } from "./components/ControlPanel/ControlPanelState";
import { PresetManagerState } from "./components/PresetManager/PresetManagerState";
import { SystemSettingsState } from "./components/SystemSettings/SystemSettingsState";

export interface RootState {
    presetmanager: PresetManagerState
    controlpanel: ControlPanelState
    systemSettings: SystemSettingsState
    app: AppState
}
