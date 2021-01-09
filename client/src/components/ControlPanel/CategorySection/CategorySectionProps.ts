import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";
import { RunningEffect } from "../../../domain/RunningEffect";
import { stopAll } from "../ControlPanelActions";

export interface CategorySectionProps {
    presets?: Preset[]
    runningEffects?: RunningEffect[]
    effectType: EffectType

    stopAll: HandleThunkActionCreator<typeof stopAll>
}
