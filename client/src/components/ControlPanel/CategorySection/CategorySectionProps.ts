import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";
import { RunningEffect } from "../../../domain/RunningEffect";
import { runStopAll } from "../ControlPanelActions";

export interface CategorySectionProps {
    presets: Preset[]
    runningEffects: RunningEffect[]
    effectType: EffectType

    stopAll: HandleThunkActionCreator<typeof runStopAll>
}
