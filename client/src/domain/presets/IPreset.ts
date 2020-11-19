export interface IPreset {
    id: string
    displayName: string
    description?: string
    keyBinding?: number
    midiMappings?: midiMappings[]
}

export interface midiMappings {
    key: number
    channel: number
    behavior: string
}

export const MidiBehaviorTypes: Record<string, string> = {
    trigger: "Triggers the effect on MIDI input",
    startStop: "Runs the effect while the note is on",
    clock: "Keeps the clock attached to the clock while the note is on"
};
