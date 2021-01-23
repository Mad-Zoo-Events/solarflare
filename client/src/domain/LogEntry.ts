export enum LogLevel {
    Info,
    Success,
    Warn,
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
    case LogLevel.Warn:
        return "orange";
    default:
        return "accent";
    }
};
