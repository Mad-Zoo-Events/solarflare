import { PresetCollection } from "../domain/PresetCollection";
import axios from "axios";
import { Preset } from "../domain/presets/Preset";

export async function fetchAllPresets (): Promise<PresetCollection> {
    const res = await axios.get<PresetCollection>("/presets/all");
    return Promise.resolve(res.data);
}

export async function fetchPresetsOfType (effectType: string): Promise<Preset[]> {
    const res = await axios.get<Preset[]>(`/presets/${effectType}`);
    return Promise.resolve(res.data);
}

export async function duplicatePreset (id: string, effectType: string): Promise<string> {
    const res = await axios.post<string>(`/presets/${effectType}/${id}/duplicate`);
    return Promise.resolve(res.data);
}

export async function deletePreset (id: string, effectType: string) {
    await axios.delete<string>(`/presets/${effectType}/${id}`);
}
