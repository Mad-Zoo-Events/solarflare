import { HandleThunkActionCreator } from "react-redux";
import { LogEntry } from "../../../domain/LogEntry";
import { stopAll } from "../ControlPanelActions";

export interface FooterControlsProps {
    logEntries: LogEntry[]

    stopAll: HandleThunkActionCreator<typeof stopAll>
}
