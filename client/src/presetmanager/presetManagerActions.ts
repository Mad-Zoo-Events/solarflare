import { PresetCollection } from "../domain/PresetCollection";
import fetchAllPresets from "../client/Client";
import * as actionTypes from "./presetManagerActionTypes";

export interface GetAllPresetsAction {
    type: typeof actionTypes.GET_ALL_PRESETS
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

export function getAllPresets (): GetAllPresetsAction {
    return {
        type: actionTypes.GET_ALL_PRESETS,
        payload: fetchAllPresets()
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
