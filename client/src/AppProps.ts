import { HandleThunkActionCreator } from "react-redux";
import { initializeApp } from "./AppActions";

export interface AppProps {
    isInitialized: boolean
    messageQueue: string[]

    initializeApp: HandleThunkActionCreator<typeof initializeApp>
}
