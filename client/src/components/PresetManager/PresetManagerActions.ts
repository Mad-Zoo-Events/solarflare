import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { v4 as uuid } from "uuid";
import { fetchPresetsOfType } from "../../AppActions";
import {
    deletePreset as doDeletePreset,
    duplicatePreset as doDuplicatePreset,
    testPreset as doTestPreset,
    upsertPreset as doUpsertPreset
} from "../../client/HttpClient";
import { EffectType } from "../../domain/EffectType";
import { Preset } from "../../domain/presets/Preset";
import { ToastOptions } from "../../domain/ToastOptions";
import { RootState } from "../../RootState";

// ACTION TYPES
export const SHOULD_OPEN_PRESET_MODIFIER = "presetmanager/SHOULD_OPEN_PRESET_MODIFIER";
export const SHOULD_CLOSE_PRESET_MODIFIER = "presetmanager/SHOULD_CLOSE_PRESET_MODIFIER";
export const WILL_START_TEST = "presetmanager/WILL_START_TEST";
export const DID_FINISH_TEST = "presetmanager/DID_FINISH_TEST";
export const SHOULD_SHOW_TOAST = "presetmanager/SHOULD_SHOW_TOAST";
export const DID_SHOW_TOAST = "presetmanager/DID_SHOW_TOAST";

interface ShouldOpenPresetModifier {
    type: typeof SHOULD_OPEN_PRESET_MODIFIER
    payload: { effectType: EffectType, preset: Preset }
}
interface DidStartTest {
    type: typeof WILL_START_TEST
}
interface DidFinishTest {
    type: typeof DID_FINISH_TEST
}
interface ShouldClosePresetModifier {
    type: typeof SHOULD_CLOSE_PRESET_MODIFIER
}
interface ShouldShowToast {
    type: typeof SHOULD_SHOW_TOAST
    payload: ToastOptions
}
interface DidShowToast {
    type: typeof DID_SHOW_TOAST
}

export type PresetManagerAction =
    ShouldOpenPresetModifier | ShouldClosePresetModifier |
    DidStartTest | DidFinishTest |
    ShouldShowToast | DidShowToast

// ACTION CREATORS
const shouldOpenPresetModifier = createAction<{ effectType: EffectType, preset: Preset }>(SHOULD_OPEN_PRESET_MODIFIER);
const shouldClosePresetModifier = createAction(SHOULD_CLOSE_PRESET_MODIFIER);
const willStartTest = createAction(WILL_START_TEST);
const didFinishTest = createAction(DID_FINISH_TEST);
const shouldShowToast = createAction<ToastOptions>(SHOULD_SHOW_TOAST);
const didShowToast = createAction(DID_SHOW_TOAST);

// ACTIONS
export const duplicatePreset = (id: string, effectType: EffectType): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doDuplicatePreset(id, effectType);

    dispatch(fetchPresetsOfType(effectType));
    dispatch(shouldShowToast({ message: "Preset duplicated", type: "info", id }));
};
export const deletePreset = (id: string, effectType: EffectType): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doDeletePreset(id, effectType);

    dispatch(fetchPresetsOfType(effectType));
    dispatch(shouldShowToast({ message: "Preset deleted!", type: "error", id }));
};
export const editPreset = (effectType: EffectType, preset?: Preset): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    preset = preset || { id: "", displayName: "" } as Preset;
    dispatch(shouldOpenPresetModifier({ effectType, preset }));
};
export const upsertPreset = (effectType: EffectType, preset: Preset): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doUpsertPreset(effectType, preset);

    dispatch(fetchPresetsOfType(effectType));
    dispatch(shouldClosePresetModifier());
    dispatch(shouldShowToast({ message: `Preset "${preset.displayName}" saved!`, type: "success", id: preset.id }));
};
export const testPreset = (effectType: EffectType, preset: Preset): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
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
