import { TypeOptions } from "react-toastify";
import { EffectType } from "../../domain/EffectType";
import { PresetCollection } from "../../domain/PresetCollection";
import { Preset } from "../../domain/presets/Preset";

export interface PresetManagerProps {
    presets: PresetCollection
    presetToEdit?: { effectType: EffectType, preset: Preset }
    toast?: { message: string, type: TypeOptions, id: string }

    clearToast: () => void
}
