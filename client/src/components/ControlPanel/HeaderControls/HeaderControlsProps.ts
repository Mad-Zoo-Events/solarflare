import { HandleThunkActionCreator } from "react-redux";
import { toggleServer, selectStage } from "../../../AppActions";
import { Server } from "../../../domain/client/Server";
import DisplayMode from "../../../domain/controlpanel/DisplayMode";
import { selectDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    servers: Server[]
    stages: string[]
    selectedStage: string
    displayMode: DisplayMode

    selectDisplayMode: HandleThunkActionCreator<typeof selectDisplayMode>
    toggleServer: HandleThunkActionCreator<typeof toggleServer>
    selectStage: HandleThunkActionCreator<typeof selectStage>
}
