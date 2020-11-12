import { IPreset } from "./IPreset";

export interface TimeshiftPreset extends IPreset {
    timeshiftEffects: TimeshiftEffect[]
}

interface TimeshiftEffect {
    amount: number
}
