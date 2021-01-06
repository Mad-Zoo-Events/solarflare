import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";

export interface CategorySectionProps {
    presets: Preset[]
    effectType: EffectType
}
