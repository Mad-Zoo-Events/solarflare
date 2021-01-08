import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelState {
    categorize: boolean
    runningEffects: RunningEffect[]

    logEntries: LogEntry[]
}
