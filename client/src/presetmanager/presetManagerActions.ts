import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { fetchAllPresetsASync } from "../client/Client";
import { PresetCollection } from "../domain/PresetCollection";
import { RootState } from "../RootState";
import * as actionTypes from "./presetManagerActionTypes";

// ACTION TYPES
export interface GetAllPresetsAction {
    type: typeof actionTypes.DID_GET_ALL_PRESETS
    payload: PresetCollection
}

export type PresetManagerAction = GetAllPresetsAction

// ACTION CREATORS
export const didGetAllPresets = createAction<PresetCollection>(actionTypes.DID_GET_ALL_PRESETS);

// ACTIONS
export const fetchAllPresets = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await fetchAllPresetsASync();
    dispatch(didGetAllPresets(resp));
};
