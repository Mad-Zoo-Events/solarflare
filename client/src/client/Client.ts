import axios from "axios";
import { EffectType } from "../domain/EffectType";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";

export async function getVersion (): Promise<string> {
    return (await axios.get<string>("/version")).data;
}

export async function fetchAllPresets (): Promise<PresetCollection> {
    return (await axios.get<PresetCollection>("/presets/all")).data;
}

export async function fetchPresetsOfType (effectType: EffectType): Promise<Preset[]> {
    return (await axios.get<Preset[]>(`/presets/${effectType}`)).data;
}

export async function upsertPreset (effectType: EffectType, preset: Preset): Promise<void> {
    return await axios.post(`/presets/${effectType}`, preset);
}

export async function testPreset (effectType: EffectType, preset: Preset): Promise<void> {
    return await axios.post(`/testPreset/${effectType}`, preset);
}

export async function duplicatePreset (id: string, effectType: EffectType): Promise<string> {
    return (await axios.post<string>(`/presets/${effectType}/${id}/duplicate`)).data;
}

export async function deletePreset (id: string, effectType: EffectType): Promise<void> {
    return await axios.delete(`/presets/${effectType}/${id}`);
}
