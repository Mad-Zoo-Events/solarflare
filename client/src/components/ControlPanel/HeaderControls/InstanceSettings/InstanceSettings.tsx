import React from "react";
import { connect } from "react-redux";
import * as is from "../../../../domain/InstanceStatus";
import { RootState } from "../../../../RootState";
import { startServer, stopServer } from "../../ControlPanelActions";
import { selectInstanceStatus } from "../../ControlPanelSelectors";
import "./InstanceSettings.scss";
import { InstanceSettingsProps } from "./InstanceSettingsProps";

const InstanceSettings = ({
    instanceStatus,
    startInstance,
    stopInstance
}: InstanceSettingsProps) => {
    let color = "gray";

    switch (instanceStatus) {
    case is.Running:
        color = "green";
        break;
    case is.Pending: case is.Initializing:
        color = "orange";
        break;
    case is.Stopped: case is.Stopping: case is.Unknown:
        color = "red";
        break;
    default:
        break;
    }

    const colorStyle = { color: `var(--${color})` };

    const disableStart = instanceStatus !== is.Stopped;
    const disableStop = instanceStatus !== is.Running;

    return (
        <div className="instance-settings__instance-status">
            <span className="instance-name">Build Instance</span>
            <span className="instance-status" style={colorStyle}>{instanceStatus.toUpperCase()}</span>

            <button
                className={`button start-button ${disableStart ? "forbidden" : ""}`}
                onClick={startInstance}
                disabled={disableStart}
            >
                    START
            </button>
            <button
                className={`button stop-button ${disableStop ? "forbidden" : ""}`}
                onClick={stopInstance}
                disabled={disableStop}
            >
                    STOP
            </button>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const instanceStatus = selectInstanceStatus(state);

    return {
        instanceStatus
    };
}

const mapDispatchToProps = {
    startInstance: startServer,
    stopInstance: stopServer
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceSettings);
