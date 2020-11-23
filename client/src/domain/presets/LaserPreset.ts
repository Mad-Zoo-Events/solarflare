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
    end: "End Crystal Laser",
    nonTargetingGuardian: "Guardian Laser",
    targetingGuardian: "Player-Tracking Guardian Laser"
};

export const getLaserSummary = (preset: LaserPreset): string => {
    const { laserEffects, laserType } = preset;
    const numOfLasers = laserEffects.length;

    return `${numOfLasers === 1
        ? `One ${LaserTypes[laserType]}`
        : `${numOfLasers} ${LaserTypes[laserType]}s`
    }`;
};
