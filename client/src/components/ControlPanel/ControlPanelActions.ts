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
export const SHOULD_CLEAR_LOGS = "controlpanel/SHOULD_CLEAR_LOGS";
export const SHOULD_INCREMENT_COUNTER = "controlpanel/INCREMENT_COUNTER";

interface ShouldChangeDisplayMode {
    type: typeof SHOULD_CHANGE_DISPLAY_MODE
    payload: boolean
}
interface DidStartEffect {
    type: typeof DID_START_EFFECT
    payload: {preset: Preset, interval: number}
}
interface DidStopEffect {
    type: typeof DID_STOP_EFFECT
    payload: string
}
interface DidStopAll {
    type: typeof DID_STOP_ALL
    payload: StopAllOptions
}
interface DidReceiveLogMessage {
    type: typeof DID_RECEIVE_LOG_MESSAGE
    payload: LogEntry
}
interface ShouldClearLogs {
    type: typeof SHOULD_CLEAR_LOGS
}
interface ShouldIncrementCounter {
    type: typeof SHOULD_INCREMENT_COUNTER
    payload: string
}

export type ControlPanelAction =
    ShouldChangeDisplayMode |
    DidStartEffect | DidStopEffect | DidStopAll |
    DidReceiveLogMessage | ShouldClearLogs |
    ShouldIncrementCounter

// ACTION CREATORS
const shouldChangeDisplayMode = createAction(SHOULD_CHANGE_DISPLAY_MODE);
const didStartEffect = createAction<{preset: Preset, interval: number}>(DID_START_EFFECT);
const didStopEffect = createAction<string>(DID_STOP_EFFECT);
const didStopAll = createAction<StopAllOptions>(DID_STOP_ALL);
const didReceiveLogMessage = createAction<LogEntry>(DID_RECEIVE_LOG_MESSAGE);
const shouldClearLogs = createAction(SHOULD_CLEAR_LOGS);
const shouldIncrementCounter = createAction<string>(SHOULD_INCREMENT_COUNTER);

// ACTIONS
export const selectDisplayMode = (categorized: boolean): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldChangeDisplayMode(categorized));
};
export const runEffect = (preset: Preset, action: EffectAction): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    const { id, effectType } = preset;

    doRunEffect(effectType, id, action);

    if (action === ea.Start) {
        const interval = window.setInterval(() => dispatch(shouldIncrementCounter(id)), 1000);
        dispatch(didStartEffect({ preset, interval }));
    }
    if (action === ea.Stop) {
        dispatch(didStopEffect(id));
    }
    if (action === ea.Restart) {
        dispatch(didStopEffect(id));

        const interval = window.setInterval(() => dispatch(shouldIncrementCounter(id)), 1000);
        dispatch(didStartEffect({ preset, interval }));
    }

    dispatch(didReceiveLogMessage({
        level: LogLevel.Success,
        category: action,
        message: preset.displayName
    }));
};
export const stopAll = (options: StopAllOptions): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    doStopAll(options);

    dispatch(didStopAll(options));

    dispatch(shouldClearLogs());

    dispatch(didReceiveLogMessage({
        level: LogLevel.Success,
        category: "STOP_ALL",
        message: options.specificTypeOnly || ""
    }));
};
export const clearLogs = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldClearLogs());
};
