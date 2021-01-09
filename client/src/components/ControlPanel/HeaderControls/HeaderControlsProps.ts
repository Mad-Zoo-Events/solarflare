import { HandleThunkActionCreator } from "react-redux";
import { Server } from "../../../domain/client/Server";
import { selectDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    displayMode: string
    servers: Server[]

    selectDisplayMode: HandleThunkActionCreator<typeof selectDisplayMode>
}
