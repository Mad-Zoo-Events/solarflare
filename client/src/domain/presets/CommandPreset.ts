import { IPreset } from "./IPreset";

export interface CommandPreset extends IPreset {
    commands: Command[]
}

interface Command {
    command: string
}

export const getCommandSummary = (preset: CommandPreset): string => {
    const { commands } = preset;
    const numOfCommands = commands.length;
    const firstWords = commands[0].command.split(" ").slice(0, 2).join(" ");

    return `${numOfCommands === 1
        ? "One command"
        : `${numOfCommands} commands`
    }: "/${firstWords} ..."`;
};
