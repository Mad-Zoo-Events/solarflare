import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Subscribe, Unsubscribe } from "../../../../domain/ClockAction";
import { RootState } from "../../../../RootState";
import { handleClockSubscription } from "../../ControlPanelActions";
import "./ClockControls.scss";
import { ClockControlsProps } from "./ClockControlsProps";

const ClockControls = ({
    onBeatAttached,
    offBeatAttached,
    clockOnBeat,
    subscriptionOptions,
    handleClockSubscription
}: ClockControlsProps): ReactElement => {
    const onBeatIcon = onBeatAttached && clockOnBeat ? "fas" : "far";
    const offBeatIcon = offBeatAttached && clockOnBeat ? "far" : "fas";
    const { isRunning } = subscriptionOptions;

    return (
        <div className="clock-controls">
            <FontAwesomeIcon
                className="button"
                icon={[onBeatIcon, "circle"]}
                size="2x"
                onClick={() => handleClockSubscription({
                    ...subscriptionOptions,
                    offBeat: false
                }, (!isRunning || offBeatAttached) ? Subscribe : Unsubscribe)}
            />
            <FontAwesomeIcon
                className="button"
                icon={[offBeatIcon, "circle"]}
                size="2x"
                onClick={() => handleClockSubscription({
                    ...subscriptionOptions,
                    offBeat: true
                }, (!isRunning || onBeatAttached) ? Subscribe : Unsubscribe)}
            />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const { clockOnBeat } = state.controlpanel;

    return {
        clockOnBeat
    };
}

const mapDispatchToProps = {
    handleClockSubscription: handleClockSubscription
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockControls);
