import { RefObject } from "react";
import { HandleThunkActionCreator } from "react-redux";
import { changeClockSpeed, setIgnoreKeystrokes, toggleClock } from "../../ControlPanelActions";

export interface ClockProps {
    bpm: number
    noteLength: number
    millis: number
    onBeat: boolean

    setIgnoreKeystrokes: HandleThunkActionCreator<typeof setIgnoreKeystrokes>
    toggleClock: HandleThunkActionCreator<typeof toggleClock>
    changeClockSpeed: HandleThunkActionCreator<typeof changeClockSpeed>

    tapButtonRef: RefObject<HTMLDivElement>
}
