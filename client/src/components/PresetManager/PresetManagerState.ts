import { TypeOptions } from "react-toastify";
import { Preset } from "../../domain/presets/Preset";

export interface PresetManagerState {
    presetToEdit?: { effectType: string, preset: Preset }
    toast?: { message: string, type: TypeOptions, id: string }
    testIsRunning: boolean
}
