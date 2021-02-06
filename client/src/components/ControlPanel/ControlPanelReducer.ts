import { createRef } from "react";
import { StopAllOptions } from "../../domain/client/StopAllOptions";
import BossbarColor from "../../domain/controlpanel/BossbarColor";
import { DefaultLayout } from "../../domain/controlpanel/DefaultLayout";
import * as EffectType from "../../domain/EffectType";
import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";
import {
    ControlPanelAction,

    DID_CHANGE_LAYOUT,

    DID_START_EFFECT,
    DID_STOP_ALL,
    DID_STOP_EFFECT,
    DID_TOGGLE_CAPS_LOCK,
    SHOULD_CHANGE_CLOCK_SPEED,
    SHOULD_CHOOSE_DISPLAY_CATEGORIES,
    SHOULD_CLEAR_LOGS,
    SHOULD_IGNORE_KEYSTROKES,
    SHOULD_INCREMENT_COUNTER,
    SHOULD_TOGGLE_CLOCK,
    SHOULD_UPDATE_BOSSBAR,
    SHOULD_WRITE_LOG
} from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    displayCategories: EffectType.allEffectTypes,
    ignoreKeystrokes: false,
    layout: DefaultLayout,
    runningEffects: new Map(),
    logEntries: [],
    clock: {
        bpm: 128.0,
        noteLength: 1.0,
        onBeat: true,
        tapButtonRef: createRef<HTMLDivElement>()
    },
    bossbar: {
        text: "",
        color: BossbarColor.ColorBlue
    }
};

const addToRunning = (
    { effect, getTimer }: {effect: RunningEffect, getTimer:(id: string) => number},
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    const { id } = effect.preset;
    const runningEffect = runningEffects.get(id);
    effect.interval = runningEffect?.interval || getTimer(id);
    effect.secondsRunning = runningEffect?.secondsRunning || effect.secondsRunning;
    return new Map(runningEffects).set(id, effect);
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
    { stopEffects, detachClocks, specificTypeOnly }: StopAllOptions,
    { runningEffects }: ControlPanelState
): Map<string, RunningEffect> => {
    const running = Array.from(runningEffects.values());
    const toStop = specificTypeOnly
        ? running.filter(e => e.preset.effectType === specificTypeOnly)
        : running;
    const idsToStop: string[] = [];
    toStop.forEach(e => {
        const runsOnClock = e.offBeatClock || e.onBeatClock;
        if (
            (detachClocks && runsOnClock) ||
            (stopEffects && !runsOnClock)
        ) {
            clearInterval(e.interval);
            idsToStop.push(e.preset.id);
        }
    });
    return new Map(running.filter(e => !idsToStop.includes(e.preset.id)).map(e => [e.preset.id, e]));
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
    case SHOULD_CHOOSE_DISPLAY_CATEGORIES:
        return {
            ...state,
            displayCategories: action.payload
        };
    case DID_CHANGE_LAYOUT:
        return {
            ...state,
            layout: action.payload
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
            clock: {
                ...state.clock,
                bpm: action.payload.clockSpeedBpm,
                noteLength: action.payload.clockSpeedMultiplier
            }
        };
    case SHOULD_TOGGLE_CLOCK:
        return {
            ...state,
            clock: {
                ...state.clock,
                onBeat: !state.clock.onBeat
            }
        };
    case SHOULD_UPDATE_BOSSBAR:
        return {
            ...state,
            bossbar: {
                text: action.payload?.title || "",
                color: action.payload?.color || state.bossbar.color
            }
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
