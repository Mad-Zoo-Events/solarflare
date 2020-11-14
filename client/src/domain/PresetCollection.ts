import { CommandPreset, DragonPreset, LaserPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "./presets";

export interface PresetCollection {
    commandPresets: CommandPreset[]
    dragonPresets: DragonPreset[]
    laserPresets: LaserPreset[]
    particlePresets: ParticlePreset[]
    potionPreset: PotionPreset[]
    timeshiftPreset: TimeshiftPreset[]
}
