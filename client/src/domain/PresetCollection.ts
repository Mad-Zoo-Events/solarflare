import { CommandPreset, DragonPreset, LaserPreset, LightningPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "./presets";

export interface PresetCollection {
    commandPresets: CommandPreset[]
    dragonPresets: DragonPreset[]
    laserPresets: LaserPreset[]
    lightningPresets: LightningPreset[]
    particlePresets: ParticlePreset[]
    potionPresets: PotionPreset[]
    timeshiftPresets: TimeshiftPreset[]
}
