export const Particle = "particle";
export const Dragon = "dragon";
export const Laser = "laser";
export const Potion = "potion";
export const Timeshift = "timeshift";
export const Command = "command";

export type EffectType =
    typeof Particle |
    typeof Dragon |
    typeof Laser |
    typeof Potion |
    typeof Timeshift |
    typeof Command;
