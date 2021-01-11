import { HandleThunkActionCreator } from "react-redux";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { PresetCollection } from "../../domain/PresetCollection";
import { RunningEffect } from "../../domain/RunningEffect";
import { handleKeyPress } from "./ControlPanelActions";

export interface ControlPanelProps {
    displayMode: DisplayMode
    ignoreKeystrokes: boolean
    presets: PresetCollection
    runningEffects: RunningEffect[]

    handleKeyPress: HandleThunkActionCreator<typeof handleKeyPress>
}
