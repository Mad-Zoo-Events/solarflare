import { StopAllOptions } from "../../domain/client/StopAllOptions";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { LogEntry } from "../../domain/LogEntry";
import { Preset } from "../../domain/presets/Preset";
import { RunningEffect } from "../../domain/RunningEffect";
import {
    ControlPanelAction,
    SHOULD_WRITE_LOG,
    DID_START_EFFECT,
    DID_STOP_ALL,
    DID_STOP_EFFECT,
    SHOULD_CHANGE_DISPLAY_MODE,
    SHOULD_CLEAR_LOGS,
    SHOULD_INCREMENT_COUNTER
} from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    displayMode: DisplayMode.Categorized,
    runningEffects: [],
    logEntries: []
};

const addToRunning = (
    { preset, interval }: {preset: Preset, interval: number},
    { runningEffects }: ControlPanelState
): RunningEffect[] => {
    const effects = [...runningEffects];
    if (!effects.find(e => e.preset.id === preset.id)) {
        effects.push({ preset, secondsRunning: 0, interval });
    }
    return effects;
};

const removeFromRunning = (
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

const stopAllRunning = (
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

const addToLogs = (
    entry: LogEntry,
    { logEntries }: ControlPanelState
): LogEntry[] => {
    const logs = [entry, ...logEntries];
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
            displayMode: action.payload
        };
    case DID_START_EFFECT:
        return {
            ...state,
            runningEffects: addToRunning(action.payload, state)
        };
    case DID_STOP_EFFECT:
        return {
            ...state,
            runningEffects: removeFromRunning(action.payload, state)
        };
    case DID_STOP_ALL:
        return {
            ...state,
            runningEffects: stopAllRunning(action.payload, state)
        };
    case SHOULD_INCREMENT_COUNTER:
        return {
            ...state,
            runningEffects: incrementCounter(action.payload, state)
        };
    case SHOULD_WRITE_LOG:
        return {
            ...state,
            logEntries: addToLogs(action.payload, state)
        };
    case SHOULD_CLEAR_LOGS:
        return {
            ...state,
            logEntries: []
        };
    default:
        return state;
    }
}

export default controlPanelReducer;
