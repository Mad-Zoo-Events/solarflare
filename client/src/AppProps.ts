import { HandleThunkActionCreator } from "react-redux";
import { handleSocketMessage, initializeApp } from "./AppActions";
import { PresetCollection } from "./domain/PresetCollection";

export interface AppProps {
    isInitialized: boolean
    messageQueue: string[]
    presets: PresetCollection

    handleSocketMessage: HandleThunkActionCreator<typeof handleSocketMessage>
    initializeApp: HandleThunkActionCreator<typeof initializeApp>
}
