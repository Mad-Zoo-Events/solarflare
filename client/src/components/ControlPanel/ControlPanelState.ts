import { RefObject } from "react";
import BossbarColor from "../../domain/controlpanel/BossbarColor";
import { EffectType } from "../../domain/EffectType";
import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelState {
    displayCategories: EffectType[]
    ignoreKeystrokes: boolean
    capsLockOn?: boolean

    runningEffects: Map<string, RunningEffect>

    logEntries: LogEntry[]

    clock: {
        bpm: number
        noteLength: number
        onBeat: boolean
        tapButtonRef: RefObject<HTMLDivElement>
    }

    bossbar: {
        text: string
        color: BossbarColor
    }
}
