import { debounce } from "lodash";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    changeClockSpeed as doChangeClockSpeed,
    runEffect as doRunEffect,
    stopAll as doStopAll,
    subscribeToClock as doSubscribeToClock,
    unsubscribeFromClock as doUnsubscribeFromClock,
    updateBossbar as doUpdateBossbar
} from "../../client/HttpClient";
import { ClearBossbar, SetBossbar } from "../../domain/BossbarAction";
import { ClockSpeedMessage } from "../../domain/client/BackendMessage";
import { BossbarOptions } from "../../domain/client/BossbarOptions";
import { ClockSpeedOptions } from "../../domain/client/ClockSpeedOptions";
import { ClockSubscriptionOptions } from "../../domain/client/ClockSubscriptionOptions";
import { StopAllOptions } from "../../domain/client/StopAllOptions";
import { ClockAction, Subscribe } from "../../domain/ClockAction";
import * as ea from "../../domain/EffectAction";
import { EffectAction } from "../../domain/EffectAction";
import * as et from "../../domain/EffectType";
import { LogEntry } from "../../domain/LogEntry";
import { Preset } from "../../domain/presets/Preset";
import { RunningEffect } from "../../domain/RunningEffect";
import { RootState } from "../../RootState";

// ACTION TYPES
export const SHOULD_CHOOSE_DISPLAY_CATEGORIES = "controlpanel/SHOULD_CHOOSE_DISPLAY_CATEGORIES";
export const SHOULD_IGNORE_KEYSTROKES = "controlpanel/SHOULD_IGNORE_KEYSTROKES";
export const DID_TOGGLE_CAPS_LOCK = "controlpanel/DID_TOGGLE_CAPS_LOCK";
export const DID_SELECT_SERVERS = "controlpanel/DID_SELECT_SERVERS";
export const DID_START_EFFECT = "controlpanel/DID_START_EFFECT";
export const DID_STOP_EFFECT = "controlpanel/DID_STOP_EFFECT";
export const DID_STOP_ALL = "controlpanel/DID_STOP_ALL";
export const SHOULD_WRITE_LOG = "controlpanel/SHOULD_WRITE_LOG";
export const SHOULD_CLEAR_LOGS = "controlpanel/SHOULD_CLEAR_LOGS";
export const SHOULD_INCREMENT_COUNTER = "controlpanel/INCREMENT_COUNTER";
export const SHOULD_CHANGE_CLOCK_SPEED = "controlpanel/SHOULD_CHANGE_CLOCK_SPEED";
export const SHOULD_TOGGLE_CLOCK = "controlpanel/SHOULD_TOGGLE_CLOCK";
export const SHOULD_UPDATE_BOSSBAR = "controlpanel/SHOULD_UPDATE_BOSSBAR";

interface ShouldChooseDisplayCategories {
    type: typeof SHOULD_CHOOSE_DISPLAY_CATEGORIES
    payload: et.EffectType[]
}
interface ShouldIgnoreKeystrokes {
    type: typeof SHOULD_IGNORE_KEYSTROKES
    payload: boolean
}
interface DidToggleCapsLock {
    type: typeof DID_TOGGLE_CAPS_LOCK
    payload: boolean
}
interface DidStartEffect {
    type: typeof DID_START_EFFECT
    payload: {effect: RunningEffect, getTimer:(id: string) => number}
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
interface ShouldChangeClockSpeed {
    type: typeof SHOULD_CHANGE_CLOCK_SPEED
    payload: ClockSpeedMessage
}
interface ShouldToggleClock {
    type: typeof SHOULD_TOGGLE_CLOCK
}
interface ShouldUpdateBossbar {
    type: typeof SHOULD_UPDATE_BOSSBAR
    payload: BossbarOptions | null
}

export type ControlPanelAction =
    ShouldChooseDisplayCategories | ShouldIgnoreKeystrokes | DidToggleCapsLock |
    DidStartEffect | DidStopEffect | DidStopAll |
    ShouldWriteLog | ShouldClearLogs |
    ShouldIncrementCounter |
    ShouldChangeClockSpeed | ShouldToggleClock |
    ShouldUpdateBossbar;

// ACTION CREATORS
const shouldChooseDisplayCategories = createAction<et.EffectType[]>(SHOULD_CHOOSE_DISPLAY_CATEGORIES);
const shouldIgnoreKeystrokes = createAction<boolean>(SHOULD_IGNORE_KEYSTROKES);
const didToggleCapsLock = createAction<boolean>(DID_TOGGLE_CAPS_LOCK);
export const didStartEffect = createAction<{effect: RunningEffect, getTimer:(id: string) => number}>(DID_START_EFFECT);
export const didStopEffect = createAction<string>(DID_STOP_EFFECT);
export const didStopAll = createAction<StopAllOptions>(DID_STOP_ALL);
export const shouldWriteLog = createAction<LogEntry>(SHOULD_WRITE_LOG);
export const shouldClearLogs = createAction(SHOULD_CLEAR_LOGS);
export const shouldIncrementCounter = createAction<string>(SHOULD_INCREMENT_COUNTER);
export const shouldChangeClockSpeed = createAction<ClockSpeedMessage>(SHOULD_CHANGE_CLOCK_SPEED);
export const shouldToggleClock = createAction(SHOULD_TOGGLE_CLOCK);
export const shouldUpdateBossbar = createAction<BossbarOptions | null>(SHOULD_UPDATE_BOSSBAR);

// ACTIONS
export const chooseDisplayCategories = (displayCategories: et.EffectType[]): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldChooseDisplayCategories(displayCategories));
};
export const setIgnoreKeystrokes = (ignore: boolean): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldIgnoreKeystrokes(ignore));
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
const debouncedClockSpeedUpdate = debounce((options: ClockSpeedOptions) => doChangeClockSpeed(options), 1000);
export const changeClockSpeed = (options: ClockSpeedOptions): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    const { bpm: clockSpeedBpm, noteLength: clockSpeedMultiplier } = options;
    dispatch(shouldChangeClockSpeed({ clockSpeedBpm, clockSpeedMultiplier }));
    debouncedClockSpeedUpdate(options);
};
export const handleClockSubscription = (options: ClockSubscriptionOptions, action: ClockAction): ThunkAction<void, RootState, null, AnyAction> => () => {
    action === Subscribe
        ? doSubscribeToClock(options)
        : doUnsubscribeFromClock(options);
};
export const toggleClock = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(shouldToggleClock());
};
const debouncedBossbarUpdate = debounce((options: BossbarOptions) => doUpdateBossbar(SetBossbar, options), 10);
export const updateBossbar = (options: BossbarOptions, sendUpdate: boolean): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    dispatch(shouldUpdateBossbar(options));
    if (sendUpdate) {
        debouncedBossbarUpdate(options);
    }
};
export const clearBossbar = (): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    doUpdateBossbar(ClearBossbar);
    dispatch(shouldUpdateBossbar(null));
};

export const handleKeyPress = (event: KeyboardEvent, presets: Preset[], runningEffects: Map<string, RunningEffect>): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    const { key } = event;

    if (event.getModifierState("CapsLock")) {
        dispatch(didToggleCapsLock(true));
    } else {
        dispatch(didToggleCapsLock(false));
    }

    switch (key) {
    case "0":
        doStopAll({ detachClocks: true, stopEffects: true });
        return;
    case "Escape" || "Esc":
        doStopAll({ detachClocks: true, stopEffects: false });
        return;
    case "-":
        doStopAll({ detachClocks: false, stopEffects: true });
        return;
    }

    const toStop = Array.from(runningEffects.values()).filter(e => e.preset.keyBindingStr === key);
    const toStartOrTrigger = presets.filter(p => p.keyBindingStr === key);
    const toStart = toStartOrTrigger
        .filter(p => p.effectType !== et.Command)
        .filter(p => !toStop.some(e => e.preset.id === p.id)); // don't start the ones that are to be stopped
    const toTrigger = toStartOrTrigger.filter(p => p.effectType === et.Command);

    toStop.forEach(e => doRunEffect(e.preset.effectType, e.preset.id, ea.Stop));
    toStart.forEach(p => doRunEffect(p.effectType, p.id, ea.Start));
    toTrigger.forEach(p => doRunEffect(p.effectType, p.id, ea.Trigger));
};
