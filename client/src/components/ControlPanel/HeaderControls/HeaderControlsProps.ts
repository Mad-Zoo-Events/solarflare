import { HandleThunkActionCreator } from "react-redux";
import { chooseStage } from "../../../AppActions";
import { Server } from "../../../domain/client/Server";
import { EffectType } from "../../../domain/EffectType";
import { changeLayout, chooseDisplayCategories, disableServer, enableServer } from "../ControlPanelActions";

export interface HeaderControlsProps {
    servers: Server[]
    stages: string[]
    selectedStage: string
    displayCategories: EffectType[]
    capsLockOn?: boolean

    chooseDisplayCategories: HandleThunkActionCreator<typeof chooseDisplayCategories>
    changeLayout: HandleThunkActionCreator<typeof changeLayout>
    chooseStage: HandleThunkActionCreator<typeof chooseStage>
    enableServer: HandleThunkActionCreator<typeof enableServer>
    disableServer: HandleThunkActionCreator<typeof disableServer>
}
