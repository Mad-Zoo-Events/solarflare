import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";
import { RunningEffect } from "../../../domain/RunningEffect";

export interface CategorySectionProps {
    presets: Preset[]
    runningEffects: Map<string, RunningEffect>
    effectType: EffectType
}
