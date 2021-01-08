import { PresetCollection } from "../../domain/PresetCollection";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelProps {
    presets: PresetCollection
    runningEffects: RunningEffect[]
    categorize: boolean
}
