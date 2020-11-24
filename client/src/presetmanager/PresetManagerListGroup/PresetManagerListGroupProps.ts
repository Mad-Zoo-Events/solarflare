import { Preset } from "../../domain/presets/Preset";

export interface PresetManagerListGroupProps {
    presets: Preset[]
    headerText: string
    effectType: string
}