import { HandleThunkActionCreator } from "react-redux";
import DisplayMode from "../../domain/controlpanel/DisplayMode";
import { PresetCollection } from "../../domain/PresetCollection";
import { Preset } from "../../domain/presets/Preset";
import { RunningEffect } from "../../domain/RunningEffect";
import { handleKeyPress } from "./ControlPanelActions";

export interface ControlPanelProps {
    displayMode: DisplayMode
    ignoreKeystrokes: boolean
    presets: PresetCollection
    combinedPresets: Preset[]
    combinedPresetsWithoutCommands: Preset[]
    runningEffects: Map<string, RunningEffect>

    handleKeyPress: HandleThunkActionCreator<typeof handleKeyPress>
}
