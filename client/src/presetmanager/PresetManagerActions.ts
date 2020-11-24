import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    deletePreset as doDeletePreset,
    duplicatePreset as doDuplicatePreset,
    fetchAllPresets,
    fetchPresetsOfType,
    upsertPreset as doUpsertPreset
} from "../client/Client";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";
import { RootState } from "../RootState";

// ACTION TYPES
export const DID_GET_ALL_PRESETS = "presetmanager/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "presetmanager/DID_GET_PRESETS_OF_TYPE";
export const SHOULD_OPEN_PRESET_MODIFIER = "presetmanager/SHOULD_OPEN_PRESET_MODIFIER";
export const SHOULD_CLOSE_PRESET_MODIFIER = "presetmanager/SHOULD_CLOSE_PRESET_MODIFIER";

export interface GetAllPresetsAction {
    type: typeof DID_GET_ALL_PRESETS
    payload: PresetCollection
}
export interface GetPresetsOfType {
    type: typeof DID_GET_PRESETS_OF_TYPE
    payload: { effectType: string, presets: Preset[] }
}
export interface OpenPresetModifier {
    type: typeof SHOULD_OPEN_PRESET_MODIFIER
    payload: { effectType: string, preset: Preset }
}
export interface ClosePresetModifier {
    type: typeof SHOULD_CLOSE_PRESET_MODIFIER
}

export type PresetManagerAction = GetAllPresetsAction | GetPresetsOfType | OpenPresetModifier | ClosePresetModifier

// ACTION CREATORS
export const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
export const didGetPresetsOfType = createAction<{effectType: string, presets: Preset[]}>(DID_GET_PRESETS_OF_TYPE);
export const shouldOpenPresetModifier = createAction<{effectType: string, preset: Preset}>(SHOULD_OPEN_PRESET_MODIFIER);
export const shouldClosePresetModifier = createAction(SHOULD_CLOSE_PRESET_MODIFIER);

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
export const deletePreset = (id: string, effectType: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doDeletePreset(id, effectType);

    const presets = await fetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
export const editPreset = (effectType: string, preset?: Preset): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    preset = preset || { id: "", displayName: "" } as Preset;
    dispatch(shouldOpenPresetModifier({ effectType, preset }));
};
export const upsertPreset = (effectType: string, preset: Preset): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doUpsertPreset(effectType, preset);

    const presets = await fetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
    dispatch(shouldClosePresetModifier());
};
export const closePresetModifier = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldClosePresetModifier());
};
