import { HandleThunkActionCreator } from "react-redux";
import { InstanceStatus } from "../../../../domain/InstanceStatus";
import { startServer, stopServer } from "../../ControlPanelActions";

export interface InstanceSettingsProps {
    instanceStatus: InstanceStatus,

    startInstance: HandleThunkActionCreator<typeof startServer>
    stopInstance: HandleThunkActionCreator<typeof stopServer>
}
