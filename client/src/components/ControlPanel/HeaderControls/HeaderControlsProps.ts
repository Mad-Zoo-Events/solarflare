import { HandleThunkActionCreator } from "react-redux";
import { toggleServer } from "../../../AppActions";
import { Server } from "../../../domain/client/Server";
import { selectDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    displayMode: string
    servers: Server[]

    selectDisplayMode: HandleThunkActionCreator<typeof selectDisplayMode>
    toggleServer: HandleThunkActionCreator<typeof toggleServer>
}
