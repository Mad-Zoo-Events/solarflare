import { isRunning } from "../../utils/utils";
import { ControlPanelAction, DID_START_EFFECT, DID_STOP_EFFECT, SHOULD_CHANGE_DISPLAY_MODE } from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    categorize: true,
    runningEffects: []
};

function controlPanelReducer (
    // eslint-disable-next-line default-param-last
    state: ControlPanelState = initialState,
    action: ControlPanelAction
): ControlPanelState {
    switch (action.type) {
    case SHOULD_CHANGE_DISPLAY_MODE:
        return {
            ...state,
            categorize: action.payload
        };
    case DID_START_EFFECT:
        if (isRunning(action.payload, state)) {
            return state;
        }

        return {
            ...state,
            runningEffects: state.runningEffects.concat({ preset: action.payload, counter: 0 })
        };
    case DID_STOP_EFFECT:
        return {
            ...state,
            runningEffects: state.runningEffects.filter(e => e.preset.id !== action.payload.id)
        };
    default:
        return state;
    }
}

export default controlPanelReducer;
