import { HandleThunkActionCreator } from "react-redux";
import { toggleServer, selectStage } from "../../../AppActions";
import { Server } from "../../../domain/client/Server";
import { selectDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    servers: Server[]
    stages: string[]

    selectDisplayMode: HandleThunkActionCreator<typeof selectDisplayMode>
    toggleServer: HandleThunkActionCreator<typeof toggleServer>
    selectStage: HandleThunkActionCreator<typeof selectStage>
}
