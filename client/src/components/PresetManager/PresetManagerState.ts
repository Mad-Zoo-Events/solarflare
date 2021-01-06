import { TypeOptions } from "react-toastify";
import { EffectType } from "../../domain/EffectType";
import { Preset } from "../../domain/presets/Preset";

export interface PresetManagerState {
    presetToEdit?: { effectType: EffectType, preset: Preset }
    toast?: { message: string, type: TypeOptions, id: string }
    testIsRunning: boolean
}
