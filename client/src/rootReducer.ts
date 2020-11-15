import { combineReducers } from "redux";
import presetManagerReducer from "./presetmanager/PresetManagerReducer";

const rootReducer = combineReducers({
    presetmanager: presetManagerReducer
});

export default rootReducer;
