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
                <div className="button stop-effects" onClick={() => stopAll({ stopEffects: true, detachClocks: false })}>
                    <FontAwesomeIcon
                        icon={["far", "stop-circle"]}
                        size="3x"
                        title="'-' Stop Effects"
                    />
                    <br/>
                    <span>-</span>
                </div>
                <div className="button detach-clocks" onClick={() => stopAll({ stopEffects: false, detachClocks: true })}>
                    <FontAwesomeIcon
                        icon={["fas", "stopwatch"]}
                        size="3x"
                        title="'ESC' Detach Clocks"
                    />
                    <br/>
                    <span>ESC</span>
                </div>
                <div className="button stop-everything" onClick={() => stopAll({ stopEffects: true, detachClocks: true })}>
                    <FontAwesomeIcon
                        icon={["fas", "stop-circle"]}
                        size="3x"
                        title="'0' Stop Effects + Detach Clocks"
                    />
                    <br/>
                    <span>0</span>
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
