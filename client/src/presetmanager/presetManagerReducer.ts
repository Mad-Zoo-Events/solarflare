import { PresetManagerAction } from "./presetManagerActions";
import * as actionTypes from "./presetManagerActionTypes";
import { PresetManagerState } from "./PresetManagerState";

const initialState: PresetManagerState = {
    presets: {
        commandPresets: [],
        dragonPresets: [],
        laserPresets: [],
        particlePresets: [],
        potionPreset: [],
        timeshiftPreset: []
    }
};

function presetManagerReducer (
    // eslint-disable-next-line default-param-last
    state: PresetManagerState = initialState,
    action: PresetManagerAction
): PresetManagerState {
    switch (action.type) {
    case actionTypes.DID_GET_ALL_PRESETS:
        return {
            presets: action.payload
        };
    case actionTypes.DELETE_PRESET:
        return {
            presets: state.presets
        };
    case actionTypes.DUPLICATE_PRESET:
        return {
            presets: state.presets
        };
    default:
        return state;
    }
}

export default presetManagerReducer;
