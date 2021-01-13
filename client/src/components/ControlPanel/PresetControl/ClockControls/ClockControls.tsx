import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../../RootState";
import "./ClockControls.scss";
import { ClockControlsProps } from "./ClockControlsProps";

const ClockControls = ({
    onBeatAttached,
    offBeatAttached,
    clockOnBeat
}: ClockControlsProps): ReactElement => {
    const onBeatIcon = onBeatAttached && clockOnBeat ? "fas" : "far";
    const offBeatIcon = offBeatAttached && clockOnBeat ? "far" : "fas";

    return (
        <div className="clock-controls">
            <FontAwesomeIcon className="button" icon={[onBeatIcon, "circle"]} size="2x"/>
            <FontAwesomeIcon className="button" icon={[offBeatIcon, "circle"]} size="2x"/>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockControls);
