import { HandleThunkActionCreator } from "react-redux";
import { InstanceStatus } from "../../domain/InstanceStatus";
import { startInstance, stopInstance } from "./SystemSettingsActions";

export interface SystemSettingsProps {
    instanceStatus: InstanceStatus,

    startInstance: HandleThunkActionCreator<typeof startInstance>
    stopInstance: HandleThunkActionCreator<typeof stopInstance>
}
