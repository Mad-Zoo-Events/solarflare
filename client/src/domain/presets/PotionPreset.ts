import { IPreset } from "./IPreset";

export interface PotionPreset extends IPreset {
    potionEffects: PotionEffect[]
}

interface PotionEffect {
    type: string
    amplifier: number
}

interface PotionEffectType {
    name: string
    description: string
}

export const PotionEffectTypes: PotionEffectType[] = [
    {
        name: "BLINDNESS",
        description: "Blinds an entity"
    },
    {
        name: "DOLPHINS_GRACE",
        description: "Squee'ek uh'k kk'kkkk squeek eee'eek"
    },
    {
        name: "GLOWING",
        description: "Outlines the entity so that it can be seen from afar"
    },
    {
        name: "INVISIBILITY",
        description: "Grants invisibility"
    },
    {
        name: "JUMP",
        description: "(= jump_boost) Increases jump height"
    },
    {
        name: "LEVITATION",
        description: "Causes the entity to float into the air"
    },
    {
        name: "CONFUSION",
        description: "(= nausea) Warps vision on the client"
    },
    {
        name: "NIGHT_VISION",
        description: "Allows an entity to see in the dark"
    },
    {
        name: "DAMAGE_RESISTANCE",
        description: "(= resistance) Decreases damage dealt to an entity"
    },
    {
        name: "SLOW_FALLING",
        description: "Slows entity fall rate"
    },
    {
        name: "SLOW",
        description: "(= slowness) Decreases movement speed"
    },
    {
        name: "SPEED",
        description: "Increases movement speed"
    },
    {
        name: "WATER_BREATHING",
        description: "Allows breathing underwater"
    }
];
