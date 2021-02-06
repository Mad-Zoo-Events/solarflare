import React from "react";
import { connect } from "react-redux";
import { selectServers } from "../../../../../AppSelectors";
import * as is from "../../../../../domain/InstanceStatus";
import { RootState } from "../../../../../RootState";
import { startServer, stopServer } from "../../../ControlPanelActions";
import { InstanceSettingProps } from "./InstanceSettingProps";

const InstanceSettings = ({
    server,
    startInstance,
    stopInstance
}: InstanceSettingProps) => {
    const { id, name, instanceStatus } = server;
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
        <>
            <div className="instance-name">{name}</div>
            <div className="instance-status" style={colorStyle}>{instanceStatus?.toUpperCase() || is.Unknown}</div>

            <button
                className={`button start-button ${disableStart ? "forbidden" : ""}`}
                onClick={() => startInstance(id)}
                disabled={disableStart}
            >
                    START
            </button>
            <button
                className={`button stop-button ${disableStop ? "forbidden" : ""}`}
                onClick={() => stopInstance(id)}
                disabled={disableStop}
            >
                    STOP
            </button>
        </>
    );
};

function mapStateToProps (state: RootState) {
    const servers = selectServers(state);

    return {
        servers
    };
}

const mapDispatchToProps = {
    startInstance: startServer,
    stopInstance: stopServer
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceSettings);
