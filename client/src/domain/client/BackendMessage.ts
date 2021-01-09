import { StopAllOptions } from "./StopAllOptions";
import { ClockAction } from "../ClockAction";
import { EffectAction } from "../EffectAction";
import { EffectType } from "../EffectType";

export interface BackendMessage {
    effectUpdate?: EffectMessage
    bossbarUpdate?: BossbarMessage
    clockUpdate?: ClockMessage
    clockSpeedUpdate?: ClockSpeedMessage
    statusUpdate?: StatusMessage
    stageUpdate?: StageMessage
    commandUpdate?: CommandMessage
}

export interface EffectMessage {
    id: string
    effectType: EffectType
    displayName: string
    action: EffectAction

    errorMessage: string

    stopAll?: StopAllOptions
}

export interface BossbarMessage {
    text: string
    color: string
    action: EffectAction
}

export interface ClockMessage {
    id: string
    effectType: EffectType
    isOffBeat: boolean
    action: ClockAction
}

export interface ClockSpeedMessage {
    clockSpeedBPM: number
    clockSpeedMultiplier: number
}

export interface StatusMessage {
    activeServerIDs: string[]
}

export interface StageMessage {
    selectedStage: string
}

export interface CommandMessage {
    command: string

    errorMessage: string
}
