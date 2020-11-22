import { FormEvent } from "react";
import * as et from "../domain/EffectType";

export function getShortcutString (keyBinding?: number): string | undefined {
    return keyBinding ? String.fromCharCode(keyBinding) : undefined;
}

export function getShortcutCode (keyBindingStr?: string): number | undefined {
    return keyBindingStr?.charCodeAt(0);
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
