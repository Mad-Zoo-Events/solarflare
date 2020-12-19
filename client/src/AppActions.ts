import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { getVersion as doGetVersion } from "./client/Client";
import { RootState } from "./RootState";

// ACTION TYPES
export const DID_GET_VERSION = "app/DID_GET_VERSION";

export interface GetVersion {
    type: typeof DID_GET_VERSION,
    payload: string
}

export type AppAction = GetVersion;

// ACTION CREATORS
export const didGetVersion = createAction<string>(DID_GET_VERSION);

// ACTIONS
export const getVersion = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await doGetVersion();
    dispatch(didGetVersion(resp));
};
