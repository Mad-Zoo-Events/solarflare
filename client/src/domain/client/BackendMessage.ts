import { BossbarAction } from "../BossbarAction";
import { ClockAction } from "../ClockAction";
import BossbarColor from "../controlpanel/BossbarColor";
import { EffectAction } from "../EffectAction";
import { EffectType } from "../EffectType";
import { ServerAction } from "../ServerAction";
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
    color: BossbarColor
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
    actionPerformed: ServerAction
    performedOnId: string
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
