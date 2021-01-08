import axios from "axios";
import { StopAllOptions } from "../domain/client/StopAllOptions";
import { EffectAction } from "../domain/EffectAction";
import { EffectType } from "../domain/EffectType";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";

// Status
export async function getVersion (): Promise<string> {
    return (await axios.get<string>("/version")).data;
}

// Preset Retrieval
export async function fetchAllPresets (): Promise<PresetCollection> {
    return (await axios.get<PresetCollection>("/presets/all")).data;
}
export async function fetchPresetsOfType (effectType: EffectType): Promise<Preset[]> {
    return (await axios.get<Preset[]>(`/presets/${effectType}`)).data;
}

// Preset Management
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

// Effects
export async function runEffect (effectType: EffectType, id: string, action: EffectAction): Promise<void> {
    return await axios.post(`/effects/run/${effectType}/${id}/${action}`);
}
export async function stopAll (options: StopAllOptions): Promise<void> {
    return await axios.post("/effects/stopall", { ...options });
}
