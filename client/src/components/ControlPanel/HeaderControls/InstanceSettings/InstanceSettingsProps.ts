import { HandleThunkActionCreator } from "react-redux";
import { InstanceStatus } from "../../../../domain/InstanceStatus";
import { startInstance, stopInstance } from "../../ControlPanelActions";

export interface InstanceSettingsProps {
    instanceStatus: InstanceStatus,

    startInstance: HandleThunkActionCreator<typeof startInstance>
    stopInstance: HandleThunkActionCreator<typeof stopInstance>
}
