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
export const INCREMENT_COUNTER = "controlpanel/INCREMENT_COUNTER";

export interface ChangeDisplayMode {
    type: typeof SHOULD_CHANGE_DISPLAY_MODE
    payload: boolean
}
export interface StartEffect {
    type: typeof DID_START_EFFECT
    payload: {id: string, interval: number}
}
export interface StopEffect {
    type: typeof DID_STOP_EFFECT
    payload: string
}
export interface IncrementCounter {
    type: typeof INCREMENT_COUNTER
    payload: string
}

export type ControlPanelAction =
    ChangeDisplayMode |
    StartEffect | StopEffect |
    IncrementCounter

// ACTION CREATORS
export const changeDisplayMode = createAction(SHOULD_CHANGE_DISPLAY_MODE);
export const startEffect = createAction<{id: string, interval: number}>(DID_START_EFFECT);
export const stopEffect = createAction<string>(DID_STOP_EFFECT);
export const incrementCounter = createAction<string>(INCREMENT_COUNTER);

// ACTIONS
export const selectDisplayMode = (categorized: boolean): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(changeDisplayMode(categorized));
};
export const runEffect = (preset: Preset, action: EffectAction): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    const { id, effectType } = preset;

    doRunEffect(effectType, id, action);

    if (action === ea.Start) {
        const interval = window.setInterval(() => dispatch(incrementCounter(id)), 1000);
        dispatch(startEffect({ id, interval }));
    }
    if (action === ea.Stop) {
        dispatch(stopEffect(id));
    }
    if (action === ea.Restart) {
        dispatch(stopEffect(id));

        const interval = window.setInterval(() => dispatch(incrementCounter(id)), 1000);
        dispatch(startEffect({ id, interval }));
    }
};
export const count = (id: string): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(incrementCounter(id));
};
