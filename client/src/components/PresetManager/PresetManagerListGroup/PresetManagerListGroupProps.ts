import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";

export interface PresetManagerListGroupProps {
    presets: Preset[]
    headerText: string
    effectType: EffectType
}
