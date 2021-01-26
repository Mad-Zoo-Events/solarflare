import { Unknown } from "../../domain/InstanceStatus";
import {
    DID_RECEIVE_INSTANCE_STATUS,

    SystemSettingsAction
} from "./SystemSettingsActions";
import { SystemSettingsState } from "./SystemSettingsState";

const initialState: SystemSettingsState = {
    instanceStatus: Unknown
};

function SystemSettingsReducer (
    // eslint-disable-next-line default-param-last
    state: SystemSettingsState = initialState,
    action: SystemSettingsAction
): SystemSettingsState {
    switch (action.type) {
    case DID_RECEIVE_INSTANCE_STATUS:
        return {
            ...state,
            instanceStatus: action.payload
        };
    default:
        return state;
    }
}

export default SystemSettingsReducer;
