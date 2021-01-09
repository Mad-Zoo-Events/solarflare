import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    runEffect as doRunEffect,
    stopAll as doStopAll
} from "../../client/HttpClient";
import { StopAllOptions } from "../../domain/client/StopAllOptions";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { EffectAction } from "../../domain/EffectAction";
import { LogEntry } from "../../domain/LogEntry";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";

// ACTION TYPES
export const SHOULD_CHANGE_DISPLAY_MODE = "controlpanel/SHOULD_CHANGE_DISPLAY_MODE";
export const DID_SELECT_SERVERS = "controlpanel/DID_SELECT_SERVERS";
export const DID_START_EFFECT = "controlpanel/DID_START_EFFECT";
export const DID_STOP_EFFECT = "controlpanel/DID_STOP_EFFECT";
export const DID_STOP_ALL = "controlpanel/DID_STOP_ALL";
export const SHOULD_WRITE_LOG = "controlpanel/SHOULD_WRITE_LOG";
export const SHOULD_CLEAR_LOGS = "controlpanel/SHOULD_CLEAR_LOGS";
export const SHOULD_INCREMENT_COUNTER = "controlpanel/INCREMENT_COUNTER";

interface ShouldChangeDisplayMode {
    type: typeof SHOULD_CHANGE_DISPLAY_MODE
    payload: DisplayMode
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
interface ShouldWriteLog {
    type: typeof SHOULD_WRITE_LOG
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
    ShouldWriteLog | ShouldClearLogs |
    ShouldIncrementCounter;

// ACTION CREATORS
const shouldChangeDisplayMode = createAction(SHOULD_CHANGE_DISPLAY_MODE);
export const didStartEffect = createAction<{preset: Preset, interval: number}>(DID_START_EFFECT);
export const didStopEffect = createAction<string>(DID_STOP_EFFECT);
export const didStopAll = createAction<StopAllOptions>(DID_STOP_ALL);
export const shouldWriteLog = createAction<LogEntry>(SHOULD_WRITE_LOG);
export const shouldClearLogs = createAction(SHOULD_CLEAR_LOGS);
export const shouldIncrementCounter = createAction<string>(SHOULD_INCREMENT_COUNTER);

// ACTIONS
export const selectDisplayMode = (displayMode: DisplayMode): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldChangeDisplayMode(displayMode));
};
export const runEffect = (preset: Preset, action: EffectAction): ThunkAction<void, RootState, null, AnyAction> => () => {
    const { id, effectType } = preset;
    doRunEffect(effectType, id, action);
};
export const stopAll = (options: StopAllOptions): ThunkAction<void, RootState, null, AnyAction> => () => {
    doStopAll(options);
};
export const clearLogs = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldClearLogs());
};
