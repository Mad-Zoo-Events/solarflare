import { RefObject } from "react";
import { Layout } from "react-grid-layout";
import BossbarColor from "../../domain/controlpanel/BossbarColor";
import { EffectType } from "../../domain/EffectType";
import { InstanceStatus } from "../../domain/InstanceStatus";
import { LogEntry } from "../../domain/LogEntry";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelState {
    displayCategories: EffectType[]
    ignoreKeystrokes: boolean
    layout: Layout[]
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

    instanceStatus: InstanceStatus
}
