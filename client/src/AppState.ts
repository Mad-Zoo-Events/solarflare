import { BackendMessage } from "./domain/client/BackendMessage";
import { Server } from "./domain/client/Server";
import { PresetCollection } from "./domain/PresetCollection";

export interface AppState {
    isInitialized: boolean

    version: string
    servers: Server[]
    stages: string[]
    presets: PresetCollection

    messageQueue: BackendMessage[]
}
