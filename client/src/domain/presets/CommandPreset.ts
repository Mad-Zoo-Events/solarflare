import { IPreset } from "./IPreset";

export interface CommandPreset extends IPreset {
    commands: Command[]
}

interface Command {
    command: string
}
