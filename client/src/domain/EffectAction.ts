export const Trigger = "trigger";
export const Start = "start";
export const Restart = "restart";
export const Stop = "stop";

export type EffectAction =
    typeof Trigger |
    typeof Start |
    typeof Restart |
    typeof Stop;
