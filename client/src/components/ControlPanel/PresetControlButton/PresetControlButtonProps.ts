import { HandleThunkActionCreator } from "react-redux";
import { EffectAction } from "../../../domain/EffectAction";
import { Preset } from "../../../domain/presets/Preset";
import { runEffect } from "../ControlPanelActions";

export interface PresetControlButtonProps {
    preset: Preset
    action: EffectAction
    color: string

    isRunning?: boolean
    denyClick?: boolean
    displayKeyBinding?: boolean
    secondsRunning?: number

    runEffect: HandleThunkActionCreator<typeof runEffect>
}
