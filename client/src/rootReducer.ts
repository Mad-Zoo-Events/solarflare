import { combineReducers } from "redux";
import presetManagerReducer from "./components/PresetManager/PresetManagerReducer";

const rootReducer = combineReducers({
    presetmanager: presetManagerReducer
});

export default rootReducer;
