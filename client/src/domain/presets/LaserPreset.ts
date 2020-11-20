import { IPreset } from "./IPreset";

export interface LaserPreset extends IPreset {
    laserType: string
    laserEffects: LaserEffect[]
}

interface LaserEffect {
    start: number
    end: number
}

export const LaserTypes: Record<string, string> = {
    end: "End crystal laser connecting the start and end point",
    nonTargetingGuardian: "Guardian laser connecting the start and end point",
    targetingGuardian: "Guardian laser which is targeting a player from the start point"
};
