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
    SHOULD_INCREMENT_COUNTER,
    SHOULD_IGNORE_KEYSTROKES
} from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    displayMode: DisplayMode.Categorized,
    ignoreKeystrokes: false,
    runningEffects: new Map(),
    logEntries: [],
    clockBpm: 128.0,
    clockNoteLength: 1.0
};

const addToRunning = (
    { preset, interval }: {preset: Preset, interval: number},
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    return new Map(runningEffects).set(preset.id, { preset, secondsRunning: 0, interval });
};

const removeFromRunning = (
    id: string,
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    const effects = new Map(runningEffects);
    clearTimeout(effects.get(id)?.interval);
    effects.delete(id);
    return effects;
};

const stopAllRunning = (
    { stopEffects, specificTypeOnly }: StopAllOptions,
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    const running = Array.from(runningEffects.values());
    const toStop = specificTypeOnly
        ? running.filter(e => e.preset.effectType === specificTypeOnly)
        : running;
    toStop.forEach(e => {
        if (stopEffects) {
            clearTimeout(e.interval);
        }
    });
    return specificTypeOnly
        ? new Map(running.filter(e => e.preset.effectType !== specificTypeOnly).map(e => [e.preset.id, e]))
        : new Map();
};

const incrementCounter = (
    id: string,
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    const effects = new Map(runningEffects);
    const effect = effects.get(id);
    if (effect) effect.secondsRunning++;
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
    case SHOULD_IGNORE_KEYSTROKES:
        return {
            ...state,
            ignoreKeystrokes: action.payload
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
