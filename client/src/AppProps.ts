import { HandleThunkActionCreator } from "react-redux";
import { handleSocketMessage, initializeApp } from "./AppActions";
import { BackendMessage } from "./domain/client/BackendMessage";
import { PresetCollection } from "./domain/PresetCollection";

export interface AppProps {
    isInitialized: boolean
    messageQueue: BackendMessage[]
    presets: PresetCollection
    ignoreKeystrokes: boolean

    handleSocketMessage: HandleThunkActionCreator<typeof handleSocketMessage>
    initializeApp: HandleThunkActionCreator<typeof initializeApp>
}
