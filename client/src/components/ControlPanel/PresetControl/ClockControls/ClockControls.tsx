import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Subscribe, Unsubscribe } from "../../../../domain/ClockAction";
import { RootState } from "../../../../RootState";
import { handleClockSubscription } from "../../ControlPanelActions";
import { selectClockOnBeat } from "../../ControlPanelSelectors";
import "./ClockControls.scss";
import { ClockControlsProps } from "./ClockControlsProps";

const ClockControls = ({
    onBeatAttached,
    offBeatAttached,
    clockOnBeat,
    subscriptionOptions,
    color,
    handleClockSubscription
}: ClockControlsProps): ReactElement => {
    const { isRunning } = subscriptionOptions;

    const onBeatClass = isRunning && onBeatAttached
        ? clockOnBeat
            ? "attached"
            : "attached negative"
        : "negative";
    const offBeatClass = isRunning && offBeatAttached
        ? clockOnBeat
            ? "attached negative"
            : "attached"
        : "";
    const notAttached = !onBeatAttached && !offBeatAttached;

    const style = { borderColor: `var(--${color}-lighter)`, backgroundColor: `var(--${color}-alpha)` };

    return (
        <div className="preset-control__clock-controls">
            <button
                className={`button clock-control ${onBeatClass}`}
                style={style}
                onClick={() => handleClockSubscription({
                    ...subscriptionOptions,
                    offBeat: false
                }, (notAttached || offBeatAttached) ? Subscribe : Unsubscribe)}
            />
            <button
                className={`button clock-control ${offBeatClass}`}
                style={style}
                onClick={() => handleClockSubscription({
                    ...subscriptionOptions,
                    offBeat: true
                }, (notAttached || onBeatAttached) ? Subscribe : Unsubscribe)}
            />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const clockOnBeat = selectClockOnBeat(state);

    return {
        clockOnBeat
    };
}

const mapDispatchToProps = {
    handleClockSubscription: handleClockSubscription
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockControls);
