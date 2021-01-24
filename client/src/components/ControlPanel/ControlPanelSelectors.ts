import { createSelector } from "reselect";
import { RunningEffect } from "../../domain/RunningEffect";
import { selectControlPanelState } from "../../rootSelectors";
import { RootState } from "../../RootState";

export const selectRunningEffects = createSelector(selectControlPanelState, ({ runningEffects }) => runningEffects);

export const selectDisplayMode = createSelector(selectControlPanelState, ({ displayMode }) => displayMode);
export const selectCapsLockOn = createSelector(selectControlPanelState, ({ capsLockOn }) => capsLockOn);
export const selectIgnoreKeystrokes = createSelector(selectControlPanelState, ({ ignoreKeystrokes }) => ignoreKeystrokes);
export const selectLogEntries = createSelector(selectControlPanelState, ({ logEntries }) => logEntries);

export const selectClock = createSelector(selectControlPanelState, ({ clock }) => clock);
export const selectClockOnBeat = createSelector(selectClock, ({ onBeat }) => onBeat);
export const selectClockBpm = createSelector(selectClock, ({ bpm }) => bpm);
export const selectClockNoteLength = createSelector(selectClock, ({ noteLength }) => noteLength);
export const selectClockMillis = createSelector(selectClock, ({ noteLength, bpm }) => 60000 / bpm * noteLength);
export const selectClockTapButtonRef = createSelector(selectClock, ({ tapButtonRef }) => tapButtonRef);

export const selectBossbar = createSelector(selectControlPanelState, ({ bossbar }) => bossbar);
export const selectBossbarText = createSelector(selectBossbar, ({ text }) => text);
export const selectBossbarColor = createSelector(selectBossbar, ({ color }) => color);

export function selectRunningEffect (state: RootState, id: string): RunningEffect | undefined {
    return selectRunningEffects(state)?.get(id);
}
export function selectSecondsRunning (state: RootState, id: string): number | undefined {
    return selectRunningEffect(state, id)?.secondsRunning;
}
export function selectOnBeatAttached (state: RootState, id: string): boolean {
    return selectRunningEffect(state, id)?.onBeatClock || false;
}
export function selectOffBeatAttached (state: RootState, id: string): boolean {
    return selectRunningEffect(state, id)?.offBeatClock || false;
}
