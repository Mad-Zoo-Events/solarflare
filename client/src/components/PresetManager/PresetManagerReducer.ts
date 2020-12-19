import {
    DID_FINISH_TEST,
    DID_SHOW_TOAST,
    PresetManagerAction,
    SHOULD_CLOSE_PRESET_MODIFIER,
    SHOULD_OPEN_PRESET_MODIFIER,
    SHOULD_SHOW_TOAST,
    WILL_START_TEST
} from "./PresetManagerActions";
import { PresetManagerState } from "./PresetManagerState";

const initialState: PresetManagerState = {
    testIsRunning: false
};

function presetManagerReducer (
    // eslint-disable-next-line default-param-last
    state: PresetManagerState = initialState,
    action: PresetManagerAction
): PresetManagerState {
    switch (action.type) {
    case SHOULD_OPEN_PRESET_MODIFIER:
        return {
            ...state,
            presetToEdit: action.payload
        };
    case SHOULD_CLOSE_PRESET_MODIFIER:
        return {
            ...state,
            presetToEdit: undefined
        };
    case WILL_START_TEST:
        return {
            ...state,
            testIsRunning: true
        };
    case DID_FINISH_TEST:
        return {
            ...state,
            testIsRunning: false
        };
    case SHOULD_SHOW_TOAST:
        return {
            ...state,
            toast: action.payload
        };
    case DID_SHOW_TOAST:
        return {
            ...state,
            toast: undefined
        };
    default:
        return state;
    }
}

export default presetManagerReducer;
