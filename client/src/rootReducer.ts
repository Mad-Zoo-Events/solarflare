import { combineReducers } from "redux";
import appReducer from "./AppReducer";
import presetManagerReducer from "./components/PresetManager/PresetManagerReducer";

const rootReducer = combineReducers({
    presetmanager: presetManagerReducer,
    app: appReducer
});

export default rootReducer;
