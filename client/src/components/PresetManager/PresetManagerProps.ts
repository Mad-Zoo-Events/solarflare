import { EffectType } from "../../domain/EffectType";
import { PresetCollection } from "../../domain/PresetCollection";
import { Preset } from "../../domain/presets/Preset";
import { ToastOptions } from "../../domain/ToastOptions";

export interface PresetManagerProps {
    presets: PresetCollection
    presetToEdit?: { effectType: EffectType, preset: Preset }
    toast?: ToastOptions

    clearToast: () => void
}
