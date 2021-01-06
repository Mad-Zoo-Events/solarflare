import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { runEffect as doRunEffect } from "../../client/Client";
import * as ea from "../../domain/EffectAction";
import { EffectAction } from "../../domain/EffectAction";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";

// ACTION TYPES
export const SHOULD_CHANGE_DISPLAY_MODE = "controlpanel/SHOULD_CHANGE_DISPLAY_MODE";
export const DID_SELECT_SERVERS = "controlpanel/DID_SELECT_SERVERS";
export const DID_START_EFFECT = "controlpanel/DID_START_EFFECT";
export const DID_STOP_EFFECT = "controlpanel/DID_STOP_EFFECT";

export interface ChangeDisplayMode {
    type: typeof SHOULD_CHANGE_DISPLAY_MODE
    payload: boolean
}
export interface StartEffect {
    type: typeof DID_START_EFFECT
    payload: Preset
}
export interface StopEffect {
    type: typeof DID_STOP_EFFECT
    payload: Preset
}
export type ControlPanelAction =
    ChangeDisplayMode |
    StartEffect | StopEffect

// ACTION CREATORS
export const changeDisplayMode = createAction(SHOULD_CHANGE_DISPLAY_MODE);
export const startEffect = createAction<Preset>(DID_START_EFFECT);
export const stopEffect = createAction<Preset>(DID_STOP_EFFECT);

// ACTIONS
export const selectDisplayMode = (categorized: boolean): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(changeDisplayMode(categorized));
};
export const runEffect = (preset: Preset, action: EffectAction): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    const { id, effectType } = preset;

    doRunEffect(effectType, id, action);

    if (action === ea.Start) {
        dispatch(startEffect(preset));
    }
    if (action === ea.Stop) {
        dispatch(stopEffect(preset));
    }
    if (action === ea.Restart) {
        dispatch(stopEffect(preset));
        dispatch(startEffect(preset));
    }
};
