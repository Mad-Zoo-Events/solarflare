import { PresetCollection } from "../domain/PresetCollection";
import axios from "axios";

export async function fetchAllPresets (): Promise<PresetCollection> {
    const res = await axios.get<PresetCollection>("/presets/all");
    return Promise.resolve(res.data);
}
