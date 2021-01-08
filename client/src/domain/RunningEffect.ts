import { Preset } from "./presets/Preset";

export interface RunningEffect {
    preset: Preset

    interval: number
    secondsRunning: number

    onBeatClock?: boolean
    offBeatClock?: boolean
}
