import { HandleThunkActionCreator } from "react-redux";
import { disableServer, enableServer, startServer, stopServer } from "../../../../../AppActions";
import { Server } from "../../../../../domain/client/Server";

export interface InstanceSettingProps {
    server: Server,

    enableServer: HandleThunkActionCreator<typeof enableServer>
    disableServer: HandleThunkActionCreator<typeof disableServer>
    startServer: HandleThunkActionCreator<typeof startServer>
    stopServer: HandleThunkActionCreator<typeof stopServer>
}
