import { IPreset } from "./IPreset";

export interface DragonPreset extends IPreset {
    dragonEffects: DragonEffect[]
}

interface DragonEffect {
    pointId: number
    static: boolean
}
