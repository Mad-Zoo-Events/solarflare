import { HandleThunkActionCreator } from "react-redux";
import { Server } from "../../../../../domain/client/Server";
import { startServer, stopServer } from "../../../ControlPanelActions";

export interface InstanceSettingProps {
    server: Server,

    startInstance: HandleThunkActionCreator<typeof startServer>
    stopInstance: HandleThunkActionCreator<typeof stopServer>
}
