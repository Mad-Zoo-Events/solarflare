import * as et from "../domain/EffectType";
import { FormEvent } from "react";

export function getShortcut (keyBinding?: number): string {
    return (keyBinding && String.fromCharCode(keyBinding)) || "";
}

export function getOnChangeNumber (e: FormEvent<HTMLInputElement>): number {
    return Number(e.currentTarget.value);
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
