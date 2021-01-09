import React, { ReactElement } from "react";
import { getColor } from "../../../../domain/LogEntry";
import { LogEntryProps } from "./LogEntryProps";
import "./LogEntry.scss";

const LogEntry = ({
    logEntry
}: LogEntryProps): ReactElement => {
    const { message, category } = logEntry;
    const timestamp = new Date().toLocaleTimeString();
    const style = { color: `var(--${getColor(logEntry)})` };
    return (
        <div className="control-panel__log-entry">
            <span>{timestamp}</span>
            <span style={style}>{category.toUpperCase()}</span>
            <span style={style}>{message}</span>
        </div>
    );
};

export default LogEntry;
