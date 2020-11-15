import * as et from "../domain/EffectType";

export function getShortcut (keyBinding?: number): string {
    return (keyBinding && String.fromCharCode(keyBinding)) || "";
}

export function getAccentColor (effectType: string): string {
    switch (effectType) {
    case et.Particle:
        return "cyan";
    case et.Dragon:
        return "magenta";
    case et.Laser:
        return "indigo";
    case et.Potion:
        return "green";
    case et.Timeshift:
        return "orange";
    case et.Command:
        return "steel";
    }

    return "teal";
}
