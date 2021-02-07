import React, { ChangeEvent } from "react";
import { connect } from "react-redux";
import { disableServer, enableServer, startServer, stopServer } from "../../../../../AppActions";
import { selectServers } from "../../../../../AppSelectors";
import * as is from "../../../../../domain/InstanceStatus";
import { RootState } from "../../../../../RootState";
import { InstanceSettingProps } from "./InstanceSettingProps";

const InstanceSettings = ({
    server,
    enableServer,
    disableServer,
    startServer,
    stopServer
}: InstanceSettingProps) => {
    const { id, name, isActive } = server;
    const instanceStatus = server.instanceStatus || is.Unknown;
    let color = "gray";

    switch (instanceStatus) {
    case is.Running:
        color = "green";
        break;
    case is.Pending: case is.Initializing: case is.Stopping:
        color = "orange";
        break;
    case is.Stopped:
        color = "red";
        break;
    default:
        break;
    }

    const colorStyle = { color: `var(--${color})` };

    const disableStop = instanceStatus !== is.Running;
    const showStart = instanceStatus === is.Stopped;

    const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
        server.isActive = event.currentTarget.checked;
        server.isActive ? enableServer(id) : disableServer(id);
    };

    return (
        <>
            <div className="instance-name">{name}</div>

            <div style={colorStyle}>{instanceStatus.toUpperCase()}</div>

            <label className="checkbox-container">Send Effects
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={handleToggle}
                />
                <span></span>
            </label>

            {showStart
                ? <button
                    className="button start-button"
                    onClick={() => startServer(id)}
                >
                    START
                </button>
                : <button
                    className={`button stop-button ${disableStop ? "forbidden" : ""}`}
                    onClick={() => stopServer(id)}
                    disabled={disableStop}
                >
                    STOP
                </button>
            }

            <div className="instance-separator"/>
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
    enableServer: enableServer,
    disableServer: disableServer,
    startServer: startServer,
    stopServer: stopServer
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceSettings);
