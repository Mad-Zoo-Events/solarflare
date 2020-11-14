import * as actionTypes from "./presetManagerActionTypes";

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

export type PresetManagerAction = DeletePresetAction | DuplicatePresetAction

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
