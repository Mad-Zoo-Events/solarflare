import { RefObject } from "react";
import { Layout } from "react-grid-layout";
import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../domain/EffectType";
import { PresetCollection } from "../../domain/PresetCollection";
import { Preset } from "../../domain/presets/Preset";
import { RunningEffect } from "../../domain/RunningEffect";
import { handleKeyPress } from "./ControlPanelActions";

export interface ControlPanelProps {
    displayCategories: EffectType[]
    layout: Layout[]
    ignoreKeystrokes: boolean

    presets: PresetCollection
    combinedPresets: Preset[]
    runningEffects: Map<string, RunningEffect>

    clockTapButtonRef: RefObject<HTMLDivElement>

    handleKeyPress: HandleThunkActionCreator<typeof handleKeyPress>
}
