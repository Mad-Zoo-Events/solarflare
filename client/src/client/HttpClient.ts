import axios from "axios";
import { BossbarAction } from "../domain/BossbarAction";
import { BossbarOptions } from "../domain/client/BossbarOptions";
import { ClockSpeedOptions } from "../domain/client/ClockSpeedOptions";
import { ClockSubscriptionOptions } from "../domain/client/ClockSubscriptionOptions";
import { Server } from "../domain/client/Server";
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
export async function toggleServer ({ id, isActive }: Server): Promise<void> {
    const action = isActive ? "enable" : "disable";
    return await axios.patch(`/servers/${id}/${action}`);
}
export async function selectStage (stage: string): Promise<void> {
    return await axios.post(`/selectstage/${stage}`);
}
export async function startStopInstance (action: ServerAction): Promise<void> {
    return await axios.post(`/buildinstance/${action}`);
}
export async function setSetting (key: string, value: string): Promise<void> {
    return await axios.post(`/settings/${key}`, value);
}
export async function getSetting<T> (key: string): Promise<T> {
    return (await axios.get<T>(`/settings/${key}`)).data;
}

// Preset Retrieval
export async function fetchAllPresets (): Promise<PresetCollection> {
    const { data } = await axios.get<PresetCollection>("/presets/all");
    decoratePresets(data);
    return data;
}
export async function fetchPresetsOfType (effectType: EffectType): Promise<Preset[]> {
    const { data } = await axios.get<Preset[]>(`/presets/${effectType}`);
    decoratePresetsOfType(data, effectType);
    return data;
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
    return await axios.post("/effects/stopall", options);
}
export async function updateBossbar (action: BossbarAction, options?: BossbarOptions): Promise<void> {
    return await axios.post(`/bossbar/${action}`, options);
}
export async function runComand (command: string): Promise<void> {
    return await axios.post("/command", { command });
}

// Clock
export async function changeClockSpeed (options: ClockSpeedOptions): Promise<void> {
    return await axios.post("/clock/speed", options);
}
export async function restartClock (): Promise<void> {
    return await axios.post("/clock/restart");
}
export async function subscribeToClock (options: ClockSubscriptionOptions): Promise<void> {
    return await axios.put("/clock/subscribe", options);
}
export async function unsubscribeFromClock (options: ClockSubscriptionOptions): Promise<void> {
    return await axios.put("/clock/unsubscribe", options);
}
