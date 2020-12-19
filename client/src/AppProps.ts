import { HandleThunkActionCreator } from "react-redux";
import { initializeApp } from "./AppActions";

export interface AppProps {
    isInitialized: boolean
    initializeApp: HandleThunkActionCreator<typeof initializeApp>
}
