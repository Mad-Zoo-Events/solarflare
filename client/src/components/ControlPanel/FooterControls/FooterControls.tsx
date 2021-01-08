import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../RootState";
import { stopAll } from "../ControlPanelActions";
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
            <div className="stop-buttons">
                <FontAwesomeIcon
                    className="button stop-effects"
                    icon={["far", "stop-circle"]}
                    size="3x"
                    title="Stop Effects"
                    onClick={() => stopAll({ stopEffects: true, detachClocks: false })}
                />
                <FontAwesomeIcon
                    className="button detach-clocks"
                    icon={["fas", "stopwatch"]}
                    size="3x"
                    title="Detach Clocks"
                    onClick={() => stopAll({ stopEffects: false, detachClocks: true })}
                />
                <FontAwesomeIcon
                    className="button stop-everything"
                    icon={["fas", "stop-circle"]}
                    size="3x"
                    title="Stop Effects + Detach Clocks"
                    onClick={() => stopAll({ stopEffects: true, detachClocks: true })}
                />
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const logEntries = state.controlpanel.logEntries;

    return {
        logEntries
    };
}

const mapDispatchToProps = {
    stopAll: stopAll
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterControls);
