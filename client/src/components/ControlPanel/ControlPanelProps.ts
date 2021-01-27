import { RefObject } from "react";
import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../domain/EffectType";
import { Preset } from "../../domain/presets/Preset";
import { RunningEffect } from "../../domain/RunningEffect";
import { handleKeyPress } from "./ControlPanelActions";

export interface ControlPanelProps {
    combinedPresets: Preset[]
    runningEffects: Map<string, RunningEffect>

    displayCategories: EffectType[]
    ignoreKeystrokes: boolean

    clockTapButtonRef: RefObject<HTMLDivElement>

    handleKeyPress: HandleThunkActionCreator<typeof handleKeyPress>
}
