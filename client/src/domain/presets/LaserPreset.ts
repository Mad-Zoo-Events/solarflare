import { IPreset } from "./IPreset";

export interface LaserPreset extends IPreset {
    isEndLaser: boolean
    isNonPlayerTargeting: boolean
    laserEffects: LaserEffect[]
}

interface LaserEffect {
    startPointId: number
    endPointId: number
}
