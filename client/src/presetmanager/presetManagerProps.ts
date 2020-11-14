import { PresetCollection } from "../domain/PresetCollection";

export interface PresetManagerProps {
    presets: PresetCollection

    setPresets: () => void
}
