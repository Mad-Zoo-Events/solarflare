import { HandleThunkActionCreator } from "react-redux";
import { fetchPresets, getVersion } from "./AppActions";

export interface AppProps {
    getVersion: HandleThunkActionCreator<typeof getVersion>
    getPresets: HandleThunkActionCreator<typeof fetchPresets>
}
