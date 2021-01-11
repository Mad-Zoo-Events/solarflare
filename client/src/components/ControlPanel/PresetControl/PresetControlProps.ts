import { Preset } from "../../../domain/presets/Preset";
import { RunningEffect } from "../../../domain/RunningEffect";

export interface PresetControlProps {
    preset: Preset
    runningEffects: Map<string, RunningEffect>
}
