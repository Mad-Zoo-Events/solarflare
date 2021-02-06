import { EffectType } from "../EffectType";

export interface ClockSubscriptionOptions {
        presetId: string
        effectType: EffectType
        isRunning: boolean
        offBeat: boolean
}
