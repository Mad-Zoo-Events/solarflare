import { createSelector } from "reselect";
import { RunningEffect } from "../../domain/RunningEffect";
import { selectControlPanelState } from "../../rootSelectors";
import { RootState } from "../../RootState";

export const selectRunningEffects = createSelector(selectControlPanelState, ({ runningEffects }) => runningEffects);

export const selectDisplayMode = createSelector(selectControlPanelState, ({ displayMode }) => displayMode);
export const selectIgnoreKeystrokes = createSelector(selectControlPanelState, ({ ignoreKeystrokes }) => ignoreKeystrokes);
export const selectLogEntries = createSelector(selectControlPanelState, ({ logEntries }) => logEntries);

export const selectClockOnBeat = createSelector(selectControlPanelState, ({ clockOnBeat }) => clockOnBeat);
export const selectClockBpm = createSelector(selectControlPanelState, ({ clockBpm }) => clockBpm);
export const selectClockNoteLength = createSelector(selectControlPanelState, ({ clockNoteLength }) => clockNoteLength);
export const selectClockMillis = createSelector(selectControlPanelState, ({ clockNoteLength, clockBpm }) => 60000 / clockBpm * clockNoteLength);

export const selectBossbarText = createSelector(selectControlPanelState, ({ bossbarText }) => bossbarText);
export const selectBossbarColor = createSelector(selectControlPanelState, ({ bossbarColor }) => bossbarColor);

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
