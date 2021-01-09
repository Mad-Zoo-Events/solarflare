import { Server } from "./domain/client/Server";
import { PresetCollection } from "./domain/PresetCollection";

export interface AppState {
    isInitialized: boolean
    version: string
    servers: Server[]
    presets: PresetCollection
}
