export const Running = "running";
export const Pending = "pending";
export const Stopped = "stopped";
export const Stopping = "stopping";
export const Unknown = "unknown";

export type InstanceStatus =
    typeof Running |
    typeof Pending |
    typeof Stopped |
    typeof Stopping |
    typeof Unknown;
