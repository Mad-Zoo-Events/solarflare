import { HandleThunkActionCreator } from "react-redux";
import { LogEntry } from "../../../domain/LogEntry";
import { runStopAll } from "../ControlPanelActions";

export interface FooterControlsProps {
    logEntries: LogEntry[]

    stopAll: HandleThunkActionCreator<typeof runStopAll>
}
