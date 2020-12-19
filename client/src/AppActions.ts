import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    fetchAllPresets as doFetchAllPresets,
    fetchPresetsOfType as doFetchPresetsOfType,
    getVersion as doGetVersion
} from "./client/Client";
import { PresetCollection } from "./domain/PresetCollection";
import { Preset } from "./domain/presets/Preset";
import { RootState } from "./RootState";

// ACTION TYPES
export const DID_GET_VERSION = "app/DID_GET_VERSION";
export const DID_GET_ALL_PRESETS = "presetmanager/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "presetmanager/DID_GET_PRESETS_OF_TYPE";

export interface GetVersion {
    type: typeof DID_GET_VERSION,
    payload: string
}
export interface GetAllPresets {
    type: typeof DID_GET_ALL_PRESETS
    payload: PresetCollection
}
export interface GetPresetsOfType {
    type: typeof DID_GET_PRESETS_OF_TYPE
    payload: { effectType: string, presets: Preset[] }
}

export type AppAction = GetVersion | GetAllPresets | GetPresetsOfType;

// ACTION CREATORS
export const didGetVersion = createAction<string>(DID_GET_VERSION);
export const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
export const didGetPresetsOfType = createAction<{ effectType: string, presets: Preset[] }>(DID_GET_PRESETS_OF_TYPE);

// ACTIONS
export const getVersion = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await doGetVersion();
    dispatch(didGetVersion(resp));
};
export const fetchPresets = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await doFetchAllPresets();
    dispatch(didGetAllPresets(resp));
};
export const fetchPresetsOfType = (effectType: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const presets = await doFetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
