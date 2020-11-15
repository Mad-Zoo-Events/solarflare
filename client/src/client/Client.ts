import { PresetCollection } from "../domain/PresetCollection";

export async function fetchAllPresets (): Promise<PresetCollection> {
    return Promise.resolve({
        commandPresets: [{
            id: "abc",
            displayName: "ABC",
            commands: ["do this"]
        }],
        dragonPresets: [],
        laserPresets: [],
        particlePresets: [],
        potionPreset: [],
        timeshiftPreset: []
    });
}
