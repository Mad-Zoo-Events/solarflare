import { EffectType } from "../EffectType";

export interface IPreset {
    id: string
    displayName: string
    description?: string
    keyBinding?: number
    keyBindingStr?: string
    midiMappings?: midiMapping[]
    effectType: EffectType
}

interface midiMapping {
    key: number
    channel: number
    behavior: string
}

export const MidiBehaviorTypes: Record<string, string> = {
    trigger: "Triggers the effect on note down",
    toggle: "Toggles the effect on or off on note down",
    hold: "Runs the effect while note down",
    clock1Toggle: "Toggles subscription of the effect to the clock's on-beat on note down",
    clock1Hold: "Keeps the effect subscribed to the clock's on-beat while note down",
    clock2Toggle: "Toggles subscription of the effect to the clock's off-beat on note down",
    clock2Hold: "Keeps the effect subscribed to the clock's off-beat while note down"
};
