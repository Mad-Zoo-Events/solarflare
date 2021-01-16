import { BossbarAction } from "../BossbarAction";
import { ClockAction } from "../ClockAction";
import { EffectAction } from "../EffectAction";
import { EffectType } from "../EffectType";
import { Server } from "./Server";
import { StopAllOptions } from "./StopAllOptions";

export interface BackendMessage {
    effectUpdate?: EffectMessage
    bossbarUpdate?: BossbarMessage
    clockUpdate?: ClockMessage
    clockSpeedUpdate?: ClockSpeedMessage
    serverUpdate?: ServerMessage
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
    action: BossbarAction
}

export interface ClockMessage {
    id: string
    effectType: EffectType
    isOffBeat: boolean
    action: ClockAction
}

export interface ClockSpeedMessage {
    clockSpeedBpm: number
    clockSpeedMultiplier: number
}

export interface ServerMessage {
    servers: Server[]
}

export interface StageMessage {
    stages: string[]
    selectedStage: string
}

export interface CommandMessage {
    command: string

    errorMessage: string
}
