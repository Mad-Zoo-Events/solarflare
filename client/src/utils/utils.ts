import { ChangeEvent } from "react";
import * as et from "../domain/EffectType";
import { CommandPreset, LaserPreset, PotionPreset, TimeshiftPreset } from "../domain/presets";
import { getCommandSummary } from "../domain/presets/CommandPreset";
import { DragonPreset, getDragonSummary } from "../domain/presets/DragonPreset";
import { getLaserSummary } from "../domain/presets/LaserPreset";
import { getParticleSummary, ParticlePreset } from "../domain/presets/ParticlePreset";
import { getPotionSummary } from "../domain/presets/PotionPreset";
import { Preset } from "../domain/presets/Preset";
import { getTimeshiftSummary } from "../domain/presets/TimeshiftPreset";

export function getShortcutString (keyBinding?: number): string | undefined {
    return keyBinding ? String.fromCharCode(keyBinding) : undefined;
}

export function getShortcutCode (keyBindingStr?: string): number | undefined {
    return keyBindingStr?.charCodeAt(0);
}

export function getOnChangeInt (e: ChangeEvent<HTMLInputElement>): number {
    return parseInt(e.currentTarget.value, 10);
}

export function getOnChangeFloat (e: ChangeEvent<HTMLInputElement>): number {
    return parseFloat(e.currentTarget.value);
}

export function getEffectName (name: string): string {
    const nameParts = name.toLowerCase().split("_").map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return nameParts.join(" ");
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

export function getSummary (preset: Preset, effectType: string): string {
    switch (effectType) {
    case et.Particle:
        return getParticleSummary(preset as ParticlePreset);
    case et.Dragon:
        return getDragonSummary(preset as DragonPreset);
    case et.Laser:
        return getLaserSummary(preset as LaserPreset);
    case et.Potion:
        return getPotionSummary(preset as PotionPreset);
    case et.Timeshift:
        return getTimeshiftSummary(preset as TimeshiftPreset);
    case et.Command:
        return getCommandSummary(preset as CommandPreset);
    }

    return "";
}
