import { ControlPanelState } from "./ControlPanelState";
import { ControlPanelAction, SHOULD_CHANGE_DISPLAY_MODE } from "./ControlPanelActions";

const initialState: ControlPanelState = {
    categorize: true
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
    default:
        return state;
    }
}

export default controlPanelReducer;
