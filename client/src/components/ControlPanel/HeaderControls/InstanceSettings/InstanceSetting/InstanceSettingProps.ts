import { HandleThunkActionCreator } from "react-redux";
import { startServer, stopServer } from "../../../../../AppActions";
import { Server } from "../../../../../domain/client/Server";

export interface InstanceSettingProps {
    server: Server,

    startInstance: HandleThunkActionCreator<typeof startServer>
    stopInstance: HandleThunkActionCreator<typeof stopServer>
}
