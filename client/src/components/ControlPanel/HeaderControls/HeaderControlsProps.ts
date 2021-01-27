import { HandleThunkActionCreator } from "react-redux";
import { chooseStage, toggleServer } from "../../../AppActions";
import { Server } from "../../../domain/client/Server";
import { EffectType } from "../../../domain/EffectType";
import { changeLayout, chooseDisplayCategories } from "../ControlPanelActions";

export interface HeaderControlsProps {
    servers: Server[]
    stages: string[]
    selectedStage: string
    displayCategories: EffectType[]
    capsLockOn?: boolean

    chooseDisplayCategories: HandleThunkActionCreator<typeof chooseDisplayCategories>
    toggleServer: HandleThunkActionCreator<typeof toggleServer>
    chooseStage: HandleThunkActionCreator<typeof chooseStage>
    changeLayout: HandleThunkActionCreator<typeof changeLayout>
}
