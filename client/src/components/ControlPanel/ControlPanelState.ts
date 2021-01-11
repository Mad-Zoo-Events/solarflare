import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelState {
    displayMode: DisplayMode
    ignoreKeystrokes: boolean
    runningEffects: RunningEffect[]

    logEntries: LogEntry[]

    clockBpm: number
    clockNoteLength: number
}
