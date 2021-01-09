import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { PresetCollection } from "../../domain/PresetCollection";
import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelProps {
    presets: PresetCollection
    runningEffects: RunningEffect[]
    displayMode: DisplayMode
}
