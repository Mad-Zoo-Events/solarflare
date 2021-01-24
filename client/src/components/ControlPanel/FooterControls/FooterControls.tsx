import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../RootState";
import { stopAll } from "../ControlPanelActions";
import { selectLogEntries } from "../ControlPanelSelectors";
import Clock from "./Clock/Clock";
import "./FooterControls.scss";
import { FooterControlsProps } from "./FooterControlsProps";
import LogEntry from "./LogEntry/LogEntry";

const FooterControls = ({
    logEntries,
    stopAll
}: FooterControlsProps): ReactElement => {
    return (
        <div className="control-panel__footer-controls">
            <div className="log-console">
                {logEntries.map((log, index) => <LogEntry key={index} logEntry={log} />)}
            </div>

            <div className="separator"/>
            <div className="clock-controls">
                <Clock/>
            </div>

            <div className="separator"/>
            <div className="stop-buttons">
                <div className="button clock-button stop-effects" onClick={() => stopAll({ stopEffects: true, detachClocks: false })}>
                    <FontAwesomeIcon
                        icon={["far", "stop-circle"]}
                        size="3x"
                        title="'-' Stop Effects"
                    />
                    <span>Stop Effects <code>►&nbsp;-&nbsp;◄</code></span>
                </div>
                <div className="separator"/>
                <div className="button clock-button detach-clocks" onClick={() => stopAll({ stopEffects: false, detachClocks: true })}>
                    <FontAwesomeIcon
                        icon={["fas", "stopwatch"]}
                        size="3x"
                        title="'ESC' Detach Clocks"
                    />
                    <span>Detach Clocks <code>►&nbsp;ESC&nbsp;◄</code></span>
                </div>
                <div className="button clock-button stop-everything" onClick={() => stopAll({ stopEffects: true, detachClocks: true })}>
                    <FontAwesomeIcon
                        icon={["fas", "stop-circle"]}
                        size="3x"
                        title="'0' Stop Effects + Detach Clocks"
                    />
                    <span>
                        Stop Effects
                        <br/>
                        &amp; Detach Clocks
                        <br/>
                        <code>►&nbsp;0&nbsp;◄</code>
                    </span>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const logEntries = selectLogEntries(state);

    return {
        logEntries
    };
}

const mapDispatchToProps = {
    stopAll: stopAll
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterControls);
