import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";
import { stopAll } from "../ControlPanelActions";

export interface CategorySectionProps {
    presets?: Preset[]
    effectType: EffectType

    stopAll: HandleThunkActionCreator<typeof stopAll>
}
