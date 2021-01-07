import { RunningEffect } from "../../domain/RunningEffect";

export interface ControlPanelState {
    categorize: boolean
    runningEffects: Map<string, RunningEffect>
}
