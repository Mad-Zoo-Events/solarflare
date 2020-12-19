import { PresetCollection } from "./domain/PresetCollection";

export interface AppState {
    version: string
    presets: PresetCollection
}
