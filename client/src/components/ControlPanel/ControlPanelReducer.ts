import { StopAllOptions } from "../../domain/client/StopAllOptions";
import { LogEntry } from "../../domain/LogEntry";
import { Preset } from "../../domain/presets/Preset";
import { RunningEffect } from "../../domain/RunningEffect";
import {
    ControlPanelAction,
    DID_RECEIVE_LOG_MESSAGE,
    DID_START_EFFECT,
    DID_STOP_ALL,
    DID_STOP_EFFECT,
    INCREMENT_COUNTER,
    SHOULD_CHANGE_DISPLAY_MODE,
    SHOULD_CLEAR_LOGS
} from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    categorize: true,
    runningEffects: [],
    logEntries: []
};

const addRunning = (
    { preset, interval }: {preset: Preset, interval: number},
    { runningEffects }: ControlPanelState
): RunningEffect[] => {
    const effects = [...runningEffects];
    if (!effects.find(e => e.preset.id === preset.id)) {
        effects.push({ preset, secondsRunning: 0, interval });
    }
    return effects;
};

const removeRunning = (
    id: string,
    { runningEffects }: ControlPanelState
): RunningEffect[] => {
    const effects = [...runningEffects];
    const effect = effects.find(e => e.preset.id === id);
    if (effect) {
        clearTimeout(effect.interval);
    }
    return effects.filter(e => e.preset.id !== id);
};

const stopAll = (
    { stopEffects, specificTypeOnly }: StopAllOptions,
    { runningEffects }: ControlPanelState
): RunningEffect[] => {
    const toStop = specificTypeOnly
        ? runningEffects.filter(e => e.preset.effectType === specificTypeOnly)
        : [...runningEffects];
    toStop.forEach(e => {
        if (stopEffects) {
            clearTimeout(e.interval);
        }
    });
    return specificTypeOnly
        ? runningEffects.filter(e => e.preset.effectType !== specificTypeOnly)
        : [];
};

const incrementCounter = (
    id: string,
    { runningEffects }: ControlPanelState
): RunningEffect[] => {
    const effects = [...runningEffects];
    const effect = effects.find(e => e.preset.id === id);
    if (effect) {
        effect.secondsRunning++;
    }
    return effects;
};

const trimLogs = (logEntries: LogEntry[]): LogEntry[] => {
    const logs = [...logEntries];
    if (logs.length > 50) {
        logs.pop();
    }
    return logs;
};

function controlPanelReducer (
    // eslint-disable-next-line default-param-last
    state: ControlPanelState = initialState,
    action: ControlPanelAction
): ControlPanelState {
    switch (action.type) {
    case SHOULD_CHANGE_DISPLAY_MODE:
        return {
            ...state,
            categorize: action.payload
        };
    case DID_START_EFFECT:
        return {
            ...state,
            runningEffects: addRunning(action.payload, state)
        };
    case DID_STOP_EFFECT:
        return {
            ...state,
            runningEffects: removeRunning(action.payload, state)
        };
    case DID_STOP_ALL:
        return {
            ...state,
            runningEffects: stopAll(action.payload, state)
        };
    case DID_RECEIVE_LOG_MESSAGE:
        return {
            ...state,
            logEntries: [action.payload, ...trimLogs(state.logEntries)]
        };
    case SHOULD_CLEAR_LOGS:
        return {
            ...state,
            logEntries: []
        };
    case INCREMENT_COUNTER:
        return {
            ...state,
            runningEffects: incrementCounter(action.payload, state)
        };
    default:
        return state;
    }
}

export default controlPanelReducer;
