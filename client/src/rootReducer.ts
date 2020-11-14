import { combineReducers } from "redux";
import presetManagerReducer from "./presetmanager/presetManagerReducer";

const rootReducer = combineReducers({
    presetmanager: presetManagerReducer
});

export default rootReducer;
