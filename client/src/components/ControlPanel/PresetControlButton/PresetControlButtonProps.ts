import { HandleThunkActionCreator } from "react-redux";
import { EffectAction } from "../../../domain/EffectAction";
import { Preset } from "../../../domain/presets/Preset";
import { RunningEffect } from "../../../domain/RunningEffect";
import { runEffect } from "../ControlPanelActions";

export interface PresetControlButtonProps {
    preset: Preset
    action: EffectAction
    color: string

    runningEffects: RunningEffect[]

    runEffect: HandleThunkActionCreator<typeof runEffect>
}
