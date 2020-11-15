import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { fetchAllPresets } from "../client/Client";
import { PresetCollection } from "../domain/PresetCollection";
import { RootState } from "../RootState";
import * as actionTypes from "./PresetManagerActionTypes";

// ACTION TYPES
export interface GetAllPresetsAction {
    type: typeof actionTypes.DID_GET_ALL_PRESETS
    payload: PresetCollection
}

export type PresetManagerAction = GetAllPresetsAction

// ACTION CREATORS
export const didGetAllPresets = createAction<PresetCollection>(actionTypes.DID_GET_ALL_PRESETS);

// ACTIONS
export const fetchPresets = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await fetchAllPresets();
    dispatch(didGetAllPresets(resp));
};
