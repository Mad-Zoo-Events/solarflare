import axios from "axios";
import { BossbarAction } from "../domain/BossbarAction";
import { BossbarOptions } from "../domain/client/BossbarOptions";
import { ClockSpeedOptions } from "../domain/client/ClockSpeedOptions";
import { ClockSubscriptionOptions } from "../domain/client/ClockSubscriptionOptions";
import { StopAllOptions } from "../domain/client/StopAllOptions";
import { EffectAction } from "../domain/EffectAction";
import { EffectType } from "../domain/EffectType";
import { PresetCollection } from "../domain/PresetCollection";
import { Preset } from "../domain/presets/Preset";
import { ServerAction } from "../domain/ServerAction";
import { decoratePresets, decoratePresetsOfType } from "../utils/utils";

// Status
export async function getVersion (): Promise<string> {
    return (await axios.get<string>("/version")).data;
}

// Backend
export async function manageServer (id: string, action: ServerAction): Promise<void> {
    return await axios.patch(`/api/servers/${id}/${action}`);
}
export async function setSetting (key: string, value: string): Promise<void> {
    return await axios.post(`/api/settings/${key}`, value);
}
export async function getSetting<T> (key: string): Promise<T> {
    return (await axios.get<T>(`/api/settings/${key}`)).data;
}

// Preset Retrieval
export async function fetchAllPresets (): Promise<PresetCollection> {
    const { data } = await axios.get<PresetCollection>("/api/presets/all");
    decoratePresets(data);
    return data;
}
export async function fetchPresetsOfType (effectType: EffectType): Promise<Preset[]> {
    const { data } = await axios.get<Preset[]>(`/api/presets/${effectType}`);
    decoratePresetsOfType(data, effectType);
    return data;
}

// Preset Management
export async function upsertPreset (effectType: EffectType, preset: Preset): Promise<void> {
    return await axios.post(`/api/presets/${effectType}`, preset);
}
export async function testPreset (effectType: EffectType, preset: Preset): Promise<void> {
    return await axios.post(`/api/testPreset/${effectType}`, preset);
}
export async function duplicatePreset (id: string, effectType: EffectType): Promise<string> {
    return (await axios.post<string>(`/api/presets/${effectType}/${id}/duplicate`)).data;
}
export async function deletePreset (id: string, effectType: EffectType): Promise<void> {
    return await axios.delete(`/api/presets/${effectType}/${id}`);
}

// Effects
export async function runEffect (effectType: EffectType, id: string, action: EffectAction): Promise<void> {
    return await axios.post(`/api/effects/run/${effectType}/${id}/${action}`);
}
export async function stopAll (options: StopAllOptions): Promise<void> {
    return await axios.post("/api/effects/stopall", options);
}
export async function updateBossbar (action: BossbarAction, options?: BossbarOptions): Promise<void> {
    return await axios.post(`/api/bossbar/${action}`, options);
}
export async function runCommand (command: string): Promise<void> {
    return await axios.post("/api/command", { command });
}

// Clock
export async function changeClockSpeed (options: ClockSpeedOptions): Promise<void> {
    return await axios.post("/api/clock/speed", options);
}
export async function restartClock (): Promise<void> {
    return await axios.post("/api/clock/restart");
}
export async function subscribeToClock (options: ClockSubscriptionOptions): Promise<void> {
    return await axios.put("/api/clock/subscribe", options);
}
export async function unsubscribeFromClock (options: ClockSubscriptionOptions): Promise<void> {
    return await axios.put("/api/clock/unsubscribe", options);
}
