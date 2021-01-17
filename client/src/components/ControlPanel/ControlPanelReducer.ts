import { StopAllOptions } from "../../domain/client/StopAllOptions";
import BossbarColor from "../../domain/controlpanel/BossbarColor";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";
import {
    ControlPanelAction,

    DID_START_EFFECT,
    DID_STOP_ALL,
    DID_STOP_EFFECT,
    DID_TOGGLE_CAPS_LOCK,
    SHOULD_CHANGE_CLOCK_SPEED,
    SHOULD_CHANGE_DISPLAY_MODE,
    SHOULD_CLEAR_LOGS,
    SHOULD_IGNORE_KEYSTROKES,
    SHOULD_INCREMENT_COUNTER,
    SHOULD_TOGGLE_CLOCK,
    SHOULD_UPDATE_BOSSBAR,
    SHOULD_WRITE_LOG
} from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    displayMode: DisplayMode.Categorized,
    ignoreKeystrokes: false,
    runningEffects: new Map(),
    logEntries: [],
    clockBpm: 128.0,
    clockNoteLength: 1.0,
    clockOnBeat: true,
    bossbarText: "",
    bossbarColor: BossbarColor.ColorBlue
};

const addToRunning = (
    effect: RunningEffect,
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    return new Map(runningEffects).set(effect.preset.id, effect);
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
    case DID_TOGGLE_CAPS_LOCK:
        return {
            ...state,
            capsLockOn: action.payload
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
    case SHOULD_CHANGE_CLOCK_SPEED:
        return {
            ...state,
            clockBpm: action.payload.clockSpeedBpm,
            clockNoteLength: action.payload.clockSpeedMultiplier
        };
    case SHOULD_TOGGLE_CLOCK:
        return {
            ...state,
            clockOnBeat: !state.clockOnBeat
        };
    case SHOULD_UPDATE_BOSSBAR:
        return {
            ...state,
            bossbarText: action.payload?.title || "",
            bossbarColor: action.payload?.color || state.bossbarColor
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
