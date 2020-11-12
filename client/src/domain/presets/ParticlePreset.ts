import { IPreset } from "./IPreset";

export interface ParticlePreset extends IPreset {
    particleEffects: ParticleEffect[]
}

interface ParticleEffect {
    name: string
    region: Region
}

interface Region {
    pointIDs: number[]
    type: string
    randomize?: boolean
    density?: number
    equation?: string
}

interface RegionType {
    name: string
    description: string
}

export const ParticleEffectRegionTypes: RegionType[] = [
    {
        name: "POINTS",
        description: "One particle at each specified point"
    },
    {
        name: "CUBOID",
        description: "Inside a cuboid specified by two points"
    },
    {
        name: "EQUATION",
        description: "In a shape described by an equation around one point"
    }
];

export const ParticleEffectTypes = [
    "ASH",
    "BARRIER",
    "BLOCK_CRACK",
    "BLOCK_DUST",
    "BUBBLE_COLUMN_UP",
    "BUBBLE_POP",
    "CAMPFIRE_COSY_SMOKE",
    "CAMPFIRE_SIGNAL_SMOKE",
    "CLOUD",
    "COMPOSTER",
    "CRIMSON_SPORE",
    "CRIT_MAGIC",
    "CRIT",
    "CURRENT_DOWN",
    "DAMAGE_INDICATOR",
    "DOLPHIN",
    "DRAGON_BREATH",
    "DRIP_LAVA",
    "DRIP_WATER",
    "DRIPPING_HONEY",
    "DRIPPING_OBSIDIAN_TEAR",
    "ENCHANTMENT_TABLE",
    "END_ROD",
    "EXPLOSION_HUGE",
    "EXPLOSION_LARGE",
    "EXPLOSION_NORMAL",
    "FALLING_DUST",
    "FALLING_HONEY",
    "FALLING_LAVA",
    "FALLING_NECTAR",
    "FALLING_OBSIDIAN_TEAR",
    "FALLING_WATER",
    "FIREWORKS_SPARK",
    "FLAME",
    "FLASH",
    "HEART",
    "ITEM_CRACK(ItemStack.class)",
    "LANDING_HONEY",
    "LANDING_LAVA",
    "LANDING_OBSIDIAN_TEAR",
    "LAVA",
    "MOB_APPEARANCE",
    "NAUTILUS",
    "NOTE",
    "PORTAL",
    "REDSTONE(DustOptions.class)",
    "REVERSE_PORTAL",
    "SLIME",
    "SMOKE_LARGE",
    "SMOKE_NORMAL",
    "SNEEZE",
    "SNOW_SHOVEL",
    "SNOWBALL",
    "SOUL_FIRE_FLAME",
    "SOUL",
    "SPELL_INSTANT",
    "SPELL_MOB_AMBIENT",
    "SPELL_MOB",
    "SPELL_WITCH",
    "SPELL",
    "SPIT",
    "SQUID_INK",
    "SUSPENDED_DEPTH",
    "SUSPENDED",
    "SWEEP_ATTACK",
    "TOTEM",
    "TOWN_AURA",
    "VILLAGER_ANGRY",
    "VILLAGER_HAPPY",
    "WARPED_SPORE",
    "WATER_BUBBLE",
    "WATER_DROP",
    "WATER_SPLASH",
    "WATER_WAKE",
    "WHITE_AS"
];
