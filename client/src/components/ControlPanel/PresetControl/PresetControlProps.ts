import { Preset } from "../../../domain/presets/Preset";

export interface PresetControlProps {
    preset: Preset
    secondsRunning?: number,
    onBeatAttached?: boolean,
    offBeatAttached?: boolean
}
