import { HandleThunkActionCreator } from "react-redux";
import { setIgnoreKeystrokes } from "../../ControlPanelActions";

export interface ClockProps {
    initialBpm: number
    initialNoteLength: number

    setIgnoreKeystrokes: HandleThunkActionCreator<typeof setIgnoreKeystrokes>
}
