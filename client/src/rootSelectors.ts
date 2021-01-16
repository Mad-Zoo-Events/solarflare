import { AppState } from "./AppState";
import { ControlPanelState } from "./components/ControlPanel/ControlPanelState";
import { PresetManagerState } from "./components/PresetManager/PresetManagerState";
import { RootState } from "./RootState";

export const selectAppState = (state: RootState): AppState => state.app;
export const selectControlPanelState = (state: RootState): ControlPanelState => state.controlpanel;
export const selectPresetManagerState = (state: RootState): PresetManagerState => state.presetmanager;
