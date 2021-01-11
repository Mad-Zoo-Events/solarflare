import { HandleThunkActionCreator } from "react-redux";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { PresetCollection } from "../../domain/PresetCollection";
import { RunningEffect } from "../../domain/RunningEffect";
import { handleKeyPress } from "./ControlPanelActions";

export interface ControlPanelProps {
    presets: PresetCollection
    runningEffects: RunningEffect[]
    displayMode: DisplayMode

    handleKeyPress: HandleThunkActionCreator<typeof handleKeyPress>
}
