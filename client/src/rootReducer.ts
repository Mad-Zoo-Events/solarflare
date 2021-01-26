import { combineReducers } from "redux";
import appReducer from "./AppReducer";
import controlPanelReducer from "./components/ControlPanel/ControlPanelReducer";
import systemSettingsReducer from "./components/SystemSettings/SystemSettingsReducer";
import presetManagerReducer from "./components/PresetManager/PresetManagerReducer";

const rootReducer = combineReducers({
    presetmanager: presetManagerReducer,
    controlpanel: controlPanelReducer,
    systemSettings: systemSettingsReducer,
    app: appReducer
});

export default rootReducer;
