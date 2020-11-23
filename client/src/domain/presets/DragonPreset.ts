import { IPreset } from "./IPreset";

export interface DragonPreset extends IPreset {
    dragonEffects: DragonEffect[]
}

interface DragonEffect {
    pointId: number
    static: boolean
}

export const getDragonSummary = (preset: DragonPreset): string => {
    const { dragonEffects } = preset;
    const numOfStatic = [...dragonEffects].filter(x => x.static).length;
    const numOfRising = dragonEffects.length - numOfStatic;

    const textForStatic = (): string => {
        if (numOfStatic === 0) {
            return "";
        }

        return `${numOfStatic === 1
            ? `One static ${numOfRising > 0 ? "and " : "dragon"}`
            : `${numOfStatic} static ${numOfRising > 0 ? "and " : "dragons"}`
        }`;
    };

    const textForRising = (): string => {
        if (numOfRising === 0) {
            return "";
        }

        return `${numOfRising === 1
            ? `${numOfStatic > 0 ? "o" : "O"}ne rising dragon`
            : `${numOfRising} rising dragons`
        }`;
    };

    return `${textForStatic()}${textForRising()} at ${dragonEffects.map(x => ` ${x.pointId}`)}`;
};
