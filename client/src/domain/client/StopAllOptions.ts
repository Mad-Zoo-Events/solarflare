import { EffectType } from "../EffectType";

export interface StopAllOptions {
    stopEffects: boolean
    detachClocks: boolean
    specificTypeOnly?: EffectType
}
