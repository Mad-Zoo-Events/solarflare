import { InstanceStatus } from "../InstanceStatus";

export interface Server {
    id: string
    name: string
    isActive: boolean
    instanceStatus: InstanceStatus
}
