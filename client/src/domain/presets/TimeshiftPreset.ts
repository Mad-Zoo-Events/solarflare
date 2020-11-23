import { IPreset } from "./IPreset";

export interface TimeshiftPreset extends IPreset {
    timeshiftEffects: TimeshiftEffect[]
}

interface TimeshiftEffect {
    amount: number
}

export const getTimeshiftSummary = (preset: TimeshiftPreset): string => {
    const { timeshiftEffects } = preset;

    if (timeshiftEffects.length > 1) {
        return `${timeshiftEffects.length} simultaneous shifts:${timeshiftEffects.map(x => ` ${x.amount}%`)}`;
    }

    return `skips ${timeshiftEffects[0].amount}% of a Minecraft day per second`;
};
