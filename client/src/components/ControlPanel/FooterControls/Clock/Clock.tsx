import debounce from "lodash/debounce";
import React, { ChangeEvent, useCallback, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../RootState";
import { setIgnoreKeystrokes } from "../../ControlPanelActions";
import "./Clock.scss";
import { ClockProps } from "./ClockProps";

const Clock = ({
    initialBpm,
    initialNoteLength,
    setIgnoreKeystrokes
}: ClockProps) => {
    const [bpm, setBpm] = useState(initialBpm);
    const [noteLength, setNoteLength] = useState(initialNoteLength);

    const updateBpm = useCallback(
        debounce((bpm: number) => console.log("BPM: ", bpm), 1000), []
    );

    const updateNoteLength = useCallback(
        (noteLength: number) => console.log("Note Length: ", noteLength), []
    );

    const handleBpmChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.valueAsNumber;
        setBpm(value);
        updateBpm(value);
    };

    const handleNoteLengthChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = parseFloat(e.currentTarget.value);
        setNoteLength(value);
        updateNoteLength(value);
    };

    return (
        <div className="clock">
            <input
                className="bpm-number-input"
                type="number"
                value={bpm}
                onFocus={() => setIgnoreKeystrokes(true)}
                onBlur={() => setIgnoreKeystrokes(false)}
                onChange={handleBpmChange}
            />
            <input
                className="bpm-range-input"
                type="range"
                min={40}
                max={240}
                value={bpm}
                onChange={handleBpmChange}
            />
            <select
                className="note-length-input"
                value={noteLength}
                onChange={handleNoteLengthChange}
            >
                <option value="32">8/1</option>
                <option value="16">4/1</option>
                <option value="8">2/1</option>
                <option value="4">1/1</option>
                <option value="2">1/2</option>
                <option value="1.3333333333333333">1/2 T</option>
                <option value="1">1/4</option>
                <option value="0.6666666666666666">1/4 T</option>
                <option value="0.5">1/8</option>
                <option value="0.3333333333333333">1/8 T</option>
                <option value="0.25">1/16</option>
                <option value="0.125">1/32</option>
            </select>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const initialBpm = state.controlpanel.clockBpm;
    const initialNoteLength = state.controlpanel.clockNoteLength;

    return {
        initialBpm,
        initialNoteLength
    };
}

const mapDispatchToProps = {
    setIgnoreKeystrokes: setIgnoreKeystrokes
};

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
