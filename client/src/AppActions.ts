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
export const DID_INITIALIZE_APP = "app/DID_INITIALIZE_APP";
export const DID_GET_VERSION = "app/DID_GET_VERSION";
export const DID_GET_ALL_PRESETS = "presetmanager/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "presetmanager/DID_GET_PRESETS_OF_TYPE";

export interface InitializeApp {
    type: typeof DID_INITIALIZE_APP,
    payload: string
}
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

export type AppAction = InitializeApp | GetVersion | GetAllPresets | GetPresetsOfType;

// ACTION CREATORS
export const didInitializeApp = createAction(DID_INITIALIZE_APP);
export const didGetVersion = createAction<string>(DID_GET_VERSION);
export const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
export const didGetPresetsOfType = createAction<{ effectType: string, presets: Preset[] }>(DID_GET_PRESETS_OF_TYPE);

// ACTIONS
export const initializeApp = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const version = await doGetVersion();
    dispatch(didGetVersion(version));

    const presetCollection = await doFetchAllPresets();
    dispatch(didGetAllPresets(presetCollection));

    dispatch(didInitializeApp());
};
export const fetchPresetsOfType = (effectType: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const presets = await doFetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
