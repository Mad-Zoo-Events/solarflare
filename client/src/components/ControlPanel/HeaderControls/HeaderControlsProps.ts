import { HandleThunkActionCreator } from "react-redux";
import { chooseStage, toggleServer } from "../../../AppActions";
import { Server } from "../../../domain/client/Server";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { chooseDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    servers: Server[]
    stages: string[]
    selectedStage: string
    displayMode: DisplayMode

    chooseDisplayMode: HandleThunkActionCreator<typeof chooseDisplayMode>
    toggleServer: HandleThunkActionCreator<typeof toggleServer>
    chooseStage: HandleThunkActionCreator<typeof chooseStage>
}
