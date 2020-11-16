import { IPreset } from "./IPreset";

export interface PotionPreset extends IPreset {
    potionEffects: PotionEffect[]
}

interface PotionEffect {
    type: string
    amplifier: number
}

export const PotionEffectTypes: Record<string, string> = {
    BLINDNESS: "Blinds an entity",
    DOLPHINS_GRACE: "Squee'ek uh'k kk'kkkk squeek eee'eek",
    GLOWING: "Outlines the entity so that it can be seen from afar",
    INVISIBILITY: "Grants invisibility",
    JUMP: "(= jump_boost) Increases jump height",
    LEVITATION: "Causes the entity to float into the air",
    CONFUSION: "(= nausea) Warps vision on the client",
    NIGHT_VISION: "Allows an entity to see in the dark",
    DAMAGE_RESISTANCE: "(= resistance) Decreases damage dealt to an entity",
    SLOW_FALLING: "Slows entity fall rate",
    SLOW: "(= slowness) Decreases movement speed",
    SPEED: "Increases movement speed",
    WATER_BREATHING: "Allows breathing underwater"
};
