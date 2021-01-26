import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    startStopInstance as doStartStopInstance
} from "../../client/HttpClient";
import * as ia from "../../domain/InstanceAction";
import { InstanceStatus } from "../../domain/InstanceStatus";
import { RootState } from "../../RootState";

// ACTION TYPES
export const DID_RECEIVE_INSTANCE_STATUS = "systemsettings/DID_RECEIVE_INSTANCE_STATUS";

interface DidReceiveInstanceStatus {
    type: typeof DID_RECEIVE_INSTANCE_STATUS
    payload: InstanceStatus
}

export type SystemSettingsAction = DidReceiveInstanceStatus;

// ACTION CREATORS
export const didReceiveInstanceStatus = createAction<InstanceStatus>(DID_RECEIVE_INSTANCE_STATUS);

// ACTIONS
export const startInstance = (): ThunkAction<void, RootState, null, AnyAction> => () => {
    doStartStopInstance(ia.StartInstance);
};
export const stopInstance = (): ThunkAction<void, RootState, null, AnyAction> => () => {
    doStartStopInstance(ia.StopInstance);
};
