import React, { ChangeEvent, useEffect } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../RootState";
import { changeClockSpeed, setIgnoreKeystrokes, toggleClock } from "../../ControlPanelActions";
import "./Clock.scss";
import { ClockProps } from "./ClockProps";

const Clock = ({
    bpm,
    noteLength,
    onBeat,
    setIgnoreKeystrokes,
    toggleClock,
    changeClockSpeed
}: ClockProps) => {
    const millis = 60000 / bpm * noteLength;

    let interval: number;
    const restartInterval = (newMillis: number) => {
        if (interval) {
            window.clearInterval(interval);
        }
        interval = window.setInterval(() => {
            toggleClock();
        }, newMillis);
    };

    useEffect(() => {
        restartInterval(millis);
        return () => {
            window.clearInterval(interval);
        };
    }, [millis]);

    const handleBpmChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.valueAsNumber;
        changeClockSpeed({ bpm: value, noteLength });
    };

    const handleNoteLengthChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = parseFloat(e.currentTarget.value);
        changeClockSpeed({ bpm, noteLength: value });
    };

    const indicatorClass = onBeat
        ? "indicator indicator-active"
        : "indicator indicator-inactive";

    return (
        <div className="clock">
            <div className={indicatorClass}>
                <span>{millis.toFixed(3)} ms</span>
            </div>
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
    const {
        clockBpm: bpm,
        clockNoteLength: noteLength,
        clockOnBeat: onBeat
    } = state.controlpanel;

    return {
        bpm,
        noteLength,
        onBeat
    };
}

const mapDispatchToProps = {
    setIgnoreKeystrokes: setIgnoreKeystrokes,
    toggleClock: toggleClock,
    changeClockSpeed: changeClockSpeed
};

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
