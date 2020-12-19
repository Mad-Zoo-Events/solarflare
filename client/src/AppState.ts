import { PresetCollection } from "./domain/PresetCollection";

export interface AppState {
    isInitialized: boolean
    version: string
    presets: PresetCollection
}
