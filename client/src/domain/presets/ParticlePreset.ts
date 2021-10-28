import { getEffectName } from "../../utils/utils";
import { IPreset } from "./IPreset";

export interface ParticlePreset extends IPreset {
    particleEffects: ParticleEffect[]
}

interface ParticleEffect {
    name: string

    pointIDList: string
    regionType: string
    randomize?: boolean
    density?: number
    quantity?: number
    equation?: string

    dustColor?: string
    toColor?: string
    dustSize?: number
    materialName?: string
}

export const ParticleEffectRegionTypes: Record<string, string> = {
    POINTS: "Points (One particle at each specified point)",
    CUBOID: "Cuboid % (Particles filling a cuboid specified by two points)",
    CUBOID_QUANTITATIVE: "Cuboid # (Defined by two points and particle count)",
    CYLINDER: "Verticle Cylinder (First point defines center, second defines height and radius)",
    SPHERE: "Sphere (First point defines center, second defines 3d radius)",
    EQUATION: "Equation (Particles filling a shape described by an equation around a single point)"
};

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
    "CRIT",
    "CRIT_MAGIC",
    "CURRENT_DOWN",
    "DAMAGE_INDICATOR",
    "DOLPHIN",
    "DRAGON_BREATH",
    "DRIP_LAVA",
    "DRIP_WATER",
    "DRIPPING_DRIPSTONE_LAVA",
    "DRIPPING_DRIPSTONE_WATER",
    "DRIPPING_HONEY",
    "DRIPPING_OBSIDIAN_TEAR",
    "DUST_COLOR_TRANSITION",
    "ELECTRIC_SPARK",
    "ELDER_GUARDIAN", // NOT LISTED ? https://hub.spigotmc.org/stash/projects/SPIGOT/repos/bukkit/browse/src/main/java/org/bukkit/Particle.java
    "ENCHANTMENT_TABLE",
    "END_ROD",
    "EXPLOSION_HUGE",
    "EXPLOSION_LARGE",
    "EXPLOSION_NORMAL",
    "FALLING_DRIPSTONE_LAVA",
    "FALLING_DRIPSTONE_WATER",
    "FALLING_DUST",
    "FALLING_HONEY",
    "FALLING_LAVA",
    "FALLING_NECTAR",
    "FALLING_OBSIDIAN_TEAR",
    "FALLING_SPORE_BLOSSOM",
    "FALLING_WATER",
    "FIREWORKS_SPARK",
    "FLAME",
    "FLASH",
    "GLOW",
    "GLOW_SQUID_INK",
    "HEART",
    "ITEM_CRACK",
    "LANDING_HONEY",
    "LANDING_LAVA",
    "LANDING_OBSIDIAN_TEAR",
    "LAVA",
    "LIGHT",
    "MOB_APPEARANCE",
    "NAUTILUS",
    "NOTE",
    "PORTAL",
    "REDSTONE",
    "REVERSE_PORTAL",
    "SCRAPE",
    "SLIME",
    "SMALL_FLAME",
    "SMOKE_LARGE",
    "SMOKE_NORMAL",
    "SNEEZE",
    "SNOW_SHOVEL",
    "SNOWBALL",
    "SNOWFLAKE",
    "SOUL",
    "SOUL_FIRE_FLAME",
    "SPELL",
    "SPELL_INSTANT",
    "SPELL_MOB",
    "SPELL_MOB_AMBIENT",
    "SPELL_WITCH",
    "SPIT",
    "SPORE_BLOSSOM_AIR",
    "SQUID_INK",
    "SUSPENDED",
    "SUSPENDED_DEPTH",
    "SWEEP_ATTACK",
    "TOTEM",
    "TOWN_AURA",
    // "VIBRATION", // This one is above my pay grade
    "VILLAGER_ANGRY",
    "VILLAGER_HAPPY",
    "WARPED_SPORE",
    "WATER_BUBBLE",
    "WATER_DROP",
    "WATER_SPLASH",
    "WATER_WAKE",
    "WAX_OFF",
    "WAX_ON",
    "WHITE_ASH"
];

export const getParticleSummary = (preset: ParticlePreset): string => {
    const { particleEffects } = preset;

    const regionString = (effect: ParticleEffect): string => {
        const { regionType, equation, pointIDList } = effect;
        const points = pointIDList.split(",");
        switch (regionType) {
        case "CUBOID":
            return `within ${points[0]} and ${points[1]}`;
        case "EQUATION":
            return `at ${points[0]}, described by '${equation}'`;
        case "POINTS":
            return `at ${pointIDList}`;
        }
        return "";
    };

    const summary = particleEffects.map((x) => ` ${getEffectName(x.name)} ${regionString(x)}`);
    if (summary.length <= 3) {
        return summary.toString();
    }

    return `${summary.slice(0, 2)}, and ${summary.length - 3} more`;
};
