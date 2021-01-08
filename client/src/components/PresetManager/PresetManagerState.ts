import { EffectType } from "../../domain/EffectType";
import { Preset } from "../../domain/presets/Preset";
import { ToastOptions } from "../../domain/ToastOptions";

export interface PresetManagerState {
    presetToEdit?: { effectType: EffectType, preset: Preset }
    toast?: ToastOptions
    testIsRunning: boolean
}
