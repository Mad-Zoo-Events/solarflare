import React from "react";
import { connect } from "react-redux";
import * as is from "../../domain/InstanceStatus";
import { RootState } from "../../RootState";
import Page from "../Page/Page";
import { startInstance, stopInstance } from "./SystemSettingsActions";
import { SystemSettingsProps } from "./SystemSettingsProps";
import "./SystemSettings.scss";
import { selectInstanceStatus } from "./SystemsSettingsSelectors";

const SystemSettings = ({
    instanceStatus,
    startInstance,
    stopInstance
}: SystemSettingsProps) => {
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
        <Page title="System Settings" renderBackButton>
            <div className="system-settings__instance-status">
                <div className="title">Build Instance</div>

                <div className="instance-status">
                    <span>Status:</span>
                    <span style={colorStyle}>{instanceStatus.toString()}</span>
                </div>

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
        </Page>
    );
};

function mapStateToProps (state: RootState) {
    const instanceStatus = selectInstanceStatus(state);

    return {
        instanceStatus
    };
}

const mapDispatchToProps = {
    startInstance: startInstance,
    stopInstance: stopInstance
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemSettings);
