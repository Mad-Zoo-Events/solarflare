import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    runEffect as doRunEffect,
    stopAll as doStopAll
} from "../../client/Client";
import { StopAllOptions } from "../../domain/client/StopAllOptions";
import * as ea from "../../domain/EffectAction";
import { EffectAction } from "../../domain/EffectAction";
import { LogEntry, LogLevel } from "../../domain/LogEntry";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";

// ACTION TYPES
export const SHOULD_CHANGE_DISPLAY_MODE = "controlpanel/SHOULD_CHANGE_DISPLAY_MODE";
export const DID_SELECT_SERVERS = "controlpanel/DID_SELECT_SERVERS";
export const DID_START_EFFECT = "controlpanel/DID_START_EFFECT";
export const DID_STOP_EFFECT = "controlpanel/DID_STOP_EFFECT";
export const DID_STOP_ALL = "controlpanel/DID_STOP_ALL";
export const DID_RECEIVE_LOG_MESSAGE = "controlpanel/DID_RECEIVE_LOG_MESSAGE";
export const INCREMENT_COUNTER = "controlpanel/INCREMENT_COUNTER";

export interface ChangeDisplayMode {
    type: typeof SHOULD_CHANGE_DISPLAY_MODE
    payload: boolean
}
export interface StartEffect {
    type: typeof DID_START_EFFECT
    payload: {preset: Preset, interval: number}
}
export interface StopEffect {
    type: typeof DID_STOP_EFFECT
    payload: string
}
export interface StopAll {
    type: typeof DID_STOP_ALL
    payload: StopAllOptions
}
export interface ReceiveLogMessage {
    type: typeof DID_RECEIVE_LOG_MESSAGE
    payload: LogEntry
}
export interface IncrementCounter {
    type: typeof INCREMENT_COUNTER
    payload: string
}

export type ControlPanelAction =
    ChangeDisplayMode |
    StartEffect | StopEffect | StopAll |
    ReceiveLogMessage |
    IncrementCounter

// ACTION CREATORS
export const changeDisplayMode = createAction(SHOULD_CHANGE_DISPLAY_MODE);
export const startEffect = createAction<{preset: Preset, interval: number}>(DID_START_EFFECT);
export const stopEffect = createAction<string>(DID_STOP_EFFECT);
export const stopAll = createAction<StopAllOptions>(DID_STOP_ALL);
export const postLogMessage = createAction<LogEntry>(DID_RECEIVE_LOG_MESSAGE);
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
        dispatch(startEffect({ preset, interval }));
    }
    if (action === ea.Stop) {
        dispatch(stopEffect(id));
    }
    if (action === ea.Restart) {
        dispatch(stopEffect(id));

        const interval = window.setInterval(() => dispatch(incrementCounter(id)), 1000);
        dispatch(startEffect({ preset, interval }));
    }

    dispatch(postLogMessage({
        level: LogLevel.Success,
        category: action,
        message: preset.displayName
    }));
};
export const runStopAll = (options: StopAllOptions): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    doStopAll(options);

    dispatch(stopAll(options));

    dispatch(postLogMessage({
        level: LogLevel.Success,
        category: "STOP_ALL",
        message: options.specificTypeOnly || ""
    }));
};
