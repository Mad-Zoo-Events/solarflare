import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { duplicatePreset as doDuplicatePreset, fetchAllPresets, fetchPresetsOfType } from "../client/Client";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";
import { RootState } from "../RootState";

// ACTION TYPES
export const DID_GET_ALL_PRESETS = "presetmanager/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "presetmanager/DID_GET_PRESETS_OF_TYPE";

export interface GetAllPresetsAction {
    type: typeof DID_GET_ALL_PRESETS
    payload: PresetCollection
}
export interface GetPresetsOfType {
    type: typeof DID_GET_PRESETS_OF_TYPE
    payload: { effectType: string, presets: Preset[] }
}

export type PresetManagerAction = GetAllPresetsAction | GetPresetsOfType

// ACTION CREATORS
export const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
export const didGetPresetsOfType = createAction<{effectType: string, presets: Preset[]}>(DID_GET_PRESETS_OF_TYPE);

// ACTIONS
export const fetchPresets = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await fetchAllPresets();
    dispatch(didGetAllPresets(resp));
};
export const duplicatePreset = (id: string, effectType: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doDuplicatePreset(id, effectType);

    const presets = await fetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
