import { EffectType } from "../../../domain/EffectType";

export interface PresetControlProps {
    effectType: EffectType
    dispalyName: string
    isGuardianLaser?: boolean
}
