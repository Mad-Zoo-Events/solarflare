import { HandleThunkActionCreator } from "react-redux";
import { chooseStage } from "../../../AppActions";
import { EffectType } from "../../../domain/EffectType";
import { changeLayout, chooseDisplayCategories } from "../ControlPanelActions";

export interface HeaderControlsProps {
    stages: string[]
    selectedStage: string
    displayCategories: EffectType[]
    capsLockOn?: boolean

    chooseDisplayCategories: HandleThunkActionCreator<typeof chooseDisplayCategories>
    changeLayout: HandleThunkActionCreator<typeof changeLayout>
    chooseStage: HandleThunkActionCreator<typeof chooseStage>
}
