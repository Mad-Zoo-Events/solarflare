import { TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { v4 as uuid } from "uuid";
import {
    deletePreset as doDeletePreset,
    duplicatePreset as doDuplicatePreset,
    fetchAllPresets,
    fetchPresetsOfType,
    testPreset as doTestPreset, upsertPreset as doUpsertPreset
} from "../../client/Client";
import { PresetCollection } from "../../domain/PresetCollection";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";

// ACTION TYPES
export const DID_GET_ALL_PRESETS = "presetmanager/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "presetmanager/DID_GET_PRESETS_OF_TYPE";
export const SHOULD_OPEN_PRESET_MODIFIER = "presetmanager/SHOULD_OPEN_PRESET_MODIFIER";
export const SHOULD_CLOSE_PRESET_MODIFIER = "presetmanager/SHOULD_CLOSE_PRESET_MODIFIER";
export const WILL_START_TEST = "presetmanager/WILL_START_TEST";
export const DID_FINISH_TEST = "presetmanager/DID_FINISH_TEST";
export const SHOULD_SHOW_TOAST = "presetmanager/SHOULD_SHOW_TOAST";
export const DID_SHOW_TOAST = "presetmanager/DID_SHOW_TOAST";

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
export interface StartTest {
    type: typeof WILL_START_TEST
}
export interface FinishTest {
    type: typeof DID_FINISH_TEST
}
export interface ClosePresetModifier {
    type: typeof SHOULD_CLOSE_PRESET_MODIFIER
}
export interface ShowToast {
    type: typeof SHOULD_SHOW_TOAST
    payload: { message: string, type: TypeOptions, id: string }
}
export interface ClearToast {
    type: typeof DID_SHOW_TOAST
}

export type PresetManagerAction =
    GetAllPresetsAction | GetPresetsOfType | OpenPresetModifier | ClosePresetModifier |
    StartTest | FinishTest | ShowToast | ClearToast

// ACTION CREATORS
export const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
export const didGetPresetsOfType = createAction<{ effectType: string, presets: Preset[] }>(DID_GET_PRESETS_OF_TYPE);
export const shouldOpenPresetModifier = createAction<{ effectType: string, preset: Preset }>(SHOULD_OPEN_PRESET_MODIFIER);
export const shouldClosePresetModifier = createAction(SHOULD_CLOSE_PRESET_MODIFIER);
export const willStartTest = createAction(WILL_START_TEST);
export const didFinishTest = createAction(DID_FINISH_TEST);
export const shouldShowToast = createAction<{ message: string, type: TypeOptions, id: string }>(SHOULD_SHOW_TOAST);
export const didShowToast = createAction(DID_SHOW_TOAST);

// ACTIONS
export const fetchPresets = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const resp = await fetchAllPresets();
    dispatch(didGetAllPresets(resp));
};
export const duplicatePreset = (id: string, effectType: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doDuplicatePreset(id, effectType);

    const presets = await fetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
    dispatch(shouldShowToast({ message: "Preset duplicated", type: "info", id }));
};
export const deletePreset = (id: string, effectType: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doDeletePreset(id, effectType);

    const presets = await fetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
    dispatch(shouldShowToast({ message: "Preset deleted!", type: "error", id }));
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
    dispatch(shouldShowToast({ message: `Preset "${preset.displayName}" saved!`, type: "success", id: preset.id }));
};
export const testPreset = (effectType: string, preset: Preset): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    dispatch(willStartTest());
    await doTestPreset(effectType, { ...preset, id: uuid() });
    dispatch(didFinishTest());
};
export const closePresetModifier = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldClosePresetModifier());
};
export const clearToast = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(didShowToast());
};
