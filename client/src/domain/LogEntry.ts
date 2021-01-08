export enum LogLevel {
    Info,
    Success,
    Error
}

export interface LogEntry{
    message: string,
    category: string,
    level: LogLevel
}

export const getColor = ({ level }: LogEntry): string => {
    switch (level) {
    case LogLevel.Success:
        return "green";
    case LogLevel.Error:
        return "red";
    default:
        return "accent";
    }
};
