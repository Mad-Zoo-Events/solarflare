import { RefObject } from "react";
import BossbarColor from "../../domain/controlpanel/BossbarColor";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelState {
    displayMode: DisplayMode
    ignoreKeystrokes: boolean
    capsLockOn?: boolean

    runningEffects: Map<string, RunningEffect>

    logEntries: LogEntry[]

    clockBpm: number
    clockNoteLength: number
    clockOnBeat: boolean
    clockTapButtonRef: RefObject<HTMLDivElement>

    bossbarText: string
    bossbarColor: BossbarColor
}
