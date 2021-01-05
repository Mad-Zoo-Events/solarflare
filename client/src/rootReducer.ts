import { combineReducers } from "redux";
import appReducer from "./AppReducer";
import controlPanelReducer from "./components/ControlPanel/ControlPanelReducer";
import presetManagerReducer from "./components/PresetManager/PresetManagerReducer";

const rootReducer = combineReducers({
    presetmanager: presetManagerReducer,
    controlpanel: controlPanelReducer,
    app: appReducer
});

export default rootReducer;
