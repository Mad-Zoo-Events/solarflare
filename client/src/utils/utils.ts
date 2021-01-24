import { times } from "lodash";
import { ChangeEvent } from "react";
import * as et from "../domain/EffectType";
import { EffectType } from "../domain/EffectType";
import { PresetCollection } from "../domain/PresetCollection";
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

export function getAccentColor (effectType: EffectType): string {
    switch (effectType) {
    case et.Particle:
        return "particle";
    case et.Dragon:
        return "dragon";
    case et.Laser:
        return "laser";
    case et.Potion:
        return "potion";
    case et.Timeshift:
        return "timeshift";
    case et.Command:
        return "command";
    }

    return "teal";
}

export function getSummary (preset: Preset, effectType: EffectType): string {
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

export function presetSorter (p1: Preset, p2: Preset): number {
    if (p1.displayName > p2.displayName) {
        return 1;
    }
    if (p1.displayName < p2.displayName) {
        return -1;
    }
    return 0;
}

export function combinePresets (presets: PresetCollection): Preset[] {
    const { commandPresets, dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets } = presets;

    return ([] as Preset[]).concat(commandPresets, dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets).sort(presetSorter);
}

export function combinePresetsWithoutCommands (presets: PresetCollection): Preset[] {
    const { dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets } = presets;

    return ([] as Preset[]).concat(dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets).sort(presetSorter);
}

export function decoratePresetsOfType (presets: Preset[], effectType: EffectType): void {
    presets.forEach(p => { p.effectType = effectType; p.keyBindingStr = getShortcutString(p.keyBinding); });
}

export function decoratePresets (presets: PresetCollection): void {
    const { commandPresets, dragonPresets, laserPresets, particlePresets, potionPresets, timeshiftPresets } = presets;

    decoratePresetsOfType(commandPresets, et.Command);
    decoratePresetsOfType(dragonPresets, et.Dragon);
    decoratePresetsOfType(laserPresets, et.Laser);
    decoratePresetsOfType(particlePresets, et.Particle);
    decoratePresetsOfType(potionPresets, et.Potion);
    decoratePresetsOfType(timeshiftPresets, et.Timeshift);
}

export function getPreset (id: string, effectType: EffectType, presets: PresetCollection): Preset | undefined {
    const {
        commandPresets,
        dragonPresets,
        laserPresets,
        particlePresets,
        timeshiftPresets,
        potionPresets
    } = presets;

    switch (effectType) {
    case et.Command:
        return commandPresets.find(p => p.id === id);
    case et.Dragon:
        return dragonPresets.find(p => p.id === id);
    case et.Laser:
        return laserPresets.find(p => p.id === id);
    case et.Particle:
        return particlePresets.find(p => p.id === id);
    case et.Timeshift:
        return timeshiftPresets.find(p => p.id === id);
    case et.Potion:
        return potionPresets.find(p => p.id === id);
    }
}

const printableChars = ["!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "=", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"];
export function getRandomString (length: number): string {
    const randomChar = () => printableChars[Math.floor(Math.random() * printableChars.length)];
    return times(length, randomChar).join("");
}
