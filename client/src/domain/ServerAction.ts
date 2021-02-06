export const EnableServer = "enable";
export const DisableServer = "disable";
export const StartServer = "start";
export const StopServer = "stop";

export type ServerAction =
    typeof EnableServer |
    typeof DisableServer |
    typeof StartServer |
    typeof StopServer;
