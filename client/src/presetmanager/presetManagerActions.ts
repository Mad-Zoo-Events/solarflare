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

export interface DeletePresetAction {
    type: typeof actionTypes.DELETE_PRESET
    payload: {
        id: string,
        effectType: string
    }
}

export interface DuplicatePresetAction {
    type: typeof actionTypes.DUPLICATE_PRESET
    payload: {
        id: string,
        effectType: string
    }
}

export type PresetManagerAction = GetAllPresetsAction | DeletePresetAction | DuplicatePresetAction

// ACTION CREATORS
export function didGetPresets (payload: PresetCollection): GetAllPresetsAction {
    return {
        type: actionTypes.DID_GET_ALL_PRESETS,
        payload
    };
};

export function detelePreset (id: string, effectType: string): DeletePresetAction {
    return {
        type: actionTypes.DELETE_PRESET,
        payload: { id, effectType }
    };
};

export function duplicatePreset (id: string, effectType: string): DuplicatePresetAction {
    return {
        type: actionTypes.DUPLICATE_PRESET,
        payload: { id, effectType }
    };
};

// ACTIONS
export const fetchAllPresets = (): ThunkAction<void, RootState, null, GetAllPresetsAction> => async dispatch => {
    const resp = await fetchAllPresetsASync();
    dispatch(didGetPresets(resp));
};
