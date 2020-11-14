import { PresetCollection } from "../domain/PresetCollection";

export default function fetchAllPresets (): PresetCollection {
    return {
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
    };
}
