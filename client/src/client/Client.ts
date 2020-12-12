import { PresetCollection } from "../domain/PresetCollection";
import axios from "axios";
import { Preset } from "../domain/presets/Preset";

export async function fetchAllPresets (): Promise<PresetCollection> {
    return (await axios.get<PresetCollection>("/presets/all")).data;
}

export async function fetchPresetsOfType (effectType: string): Promise<Preset[]> {
    return (await axios.get<Preset[]>(`/presets/${effectType}`)).data;
}

export async function upsertPreset (effectType: string, preset: Preset): Promise<void> {
    return await axios.post(`/presets/${effectType}`, preset);
}

export async function testPreset (effectType: string, preset: Preset): Promise<void> {
    preset.id = "c6a5db38-b90a-4209-b3e3-07d97cdc8cd4";
    return await axios.post(`/testPreset/${effectType}`, preset);
}

export async function duplicatePreset (id: string, effectType: string): Promise<string> {
    return (await axios.post<string>(`/presets/${effectType}/${id}/duplicate`)).data;
}

export async function deletePreset (id: string, effectType: string): Promise<void> {
    return await axios.delete(`/presets/${effectType}/${id}`);
}
