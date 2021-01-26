import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "lodash";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { restartClock } from "../../../../client/HttpClient";
import { RootState } from "../../../../RootState";
import { changeClockSpeed, setIgnoreKeystrokes, toggleClock } from "../../ControlPanelActions";
import { selectClockBpm, selectClockMillis, selectClockNoteLength, selectClockOnBeat, selectClockTapButtonRef } from "../../ControlPanelSelectors";
import "./Clock.scss";
import { ClockProps } from "./ClockProps";

const Clock = ({
    bpm,
    noteLength,
    millis,
    onBeat,
    tapButtonRef,
    setIgnoreKeystrokes,
    toggleClock,
    changeClockSpeed
}: ClockProps) => {
    const [tapBpm, setTapBpm] = useState(0);
    const [count, setCount] = useState(0);
    const [millisFirst, setMillisFirst] = useState(0);

    const tapUpdateBpm = useCallback(debounce((newBpm: number, noteLength: number, count: number) => {
        setTapBpm(0);
        setCount(0);
        if (count >= 5) changeClockSpeed({ bpm: newBpm, noteLength });
    }, 2000), []);

    const tap = () => {
        const millisNow = new Date().getTime();

        let newBpm = 0;
        if (count === 0) {
            setMillisFirst(millisNow);
            setCount(1);
        } else {
            newBpm = Math.round(60000 * count / (millisNow - millisFirst) * noteLength);
            setTapBpm(newBpm);
            setCount(count + 1);
        }

        tapUpdateBpm(newBpm, noteLength, count + 1);
    };

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
                type="number"
                step={0.1}
                value={bpm}
                onFocus={() => setIgnoreKeystrokes(true)}
                onBlur={() => setIgnoreKeystrokes(false)}
                onChange={handleBpmChange}
            />
            <input
                type="range"
                step={0.1}
                min={40}
                max={240}
                value={bpm}
                onChange={handleBpmChange}
            />
            <select
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
            <div className="button clock-button" onClick={tap} ref={tapButtonRef}>
                <FontAwesomeIcon
                    icon={["fas", "tachometer-alt"]}
                    size="3x"
                    title="'+' Tap"
                />
                <br/>
                <span><code>►&nbsp;+&nbsp;◄</code></span>
            </div>
            <div className="tap-stats">
                <span className="tap-title">TAP</span>
                <span>BPM: </span>
                <span>
                    {tapBpm === 0 ? "-" : tapBpm}
                </span>
                <span>Sample Size: </span>
                <span className={count > 0 && count < 5 ? "sample-size-too-small" : ""}>
                    {count === 0 ? "-" : count}
                </span>
            </div>
            <div className="button clock-button" onClick={restartClock}>
                <FontAwesomeIcon
                    icon={["fas", "sync"]}
                    size="3x"
                    title="Restart"
                />
                <br/>
                <span><code>restart</code></span>
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const bpm = selectClockBpm(state);
    const noteLength = selectClockNoteLength(state);
    const millis = selectClockMillis(state);
    const onBeat = selectClockOnBeat(state);
    const tapButtonRef = selectClockTapButtonRef(state);

    return {
        bpm,
        noteLength,
        millis,
        onBeat,
        tapButtonRef
    };
}

const mapDispatchToProps = {
    setIgnoreKeystrokes: setIgnoreKeystrokes,
    toggleClock: toggleClock,
    changeClockSpeed: changeClockSpeed
};

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
