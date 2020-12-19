import { AppAction, DID_GET_VERSION } from "./AppActions";
import { AppState } from "./AppState";

const initialState: AppState = {
    version: "?"
};

function appReducer (
    // eslint-disable-next-line default-param-last
    state: AppState = initialState,
    action: AppAction
): AppState {
    switch (action.type) {
    case DID_GET_VERSION:
        return {
            ...state,
            version: action.payload
        };
    default:
        return state;
    }
}

export default appReducer;
