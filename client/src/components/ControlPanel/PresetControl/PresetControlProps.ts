import { EffectType } from "../../../domain/EffectType";

export interface PresetControlProps {
    effectType: EffectType
    dispalyName: string
    keyBinding?: string
    isGuardianLaser?: boolean
}
