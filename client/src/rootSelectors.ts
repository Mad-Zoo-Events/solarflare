import { AppState } from "./AppState";
import { ControlPanelState } from "./components/ControlPanel/ControlPanelState";
import { PresetManagerState } from "./components/PresetManager/PresetManagerState";
import { SystemSettingsState } from "./components/SystemSettings/SystemSettingsState";
import { RootState } from "./RootState";

export const selectAppState = (state: RootState): AppState => state.app;
export const selectSystemSettingsState = (state: RootState): SystemSettingsState => state.systemSettings;
export const selectControlPanelState = (state: RootState): ControlPanelState => state.controlpanel;
export const selectPresetManagerState = (state: RootState): PresetManagerState => state.presetmanager;
