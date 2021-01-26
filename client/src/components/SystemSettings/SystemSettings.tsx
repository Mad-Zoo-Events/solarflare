import React from "react";
import { connect } from "react-redux";
import { RootState } from "../../RootState";
import Page from "../Page/Page";
import { startInstance, stopInstance } from "./SystemSettingsActions";
import { SystemSettingsProps } from "./SystemSettingsProps";
import { selectInstanceStatus } from "./SystemsSettingsSelectors";

const SystemSettings = ({
    instanceStatus,
    startInstance,
    stopInstance
}: SystemSettingsProps) => {
    return (
        <Page isControlPanel={false}>
            <div>{instanceStatus.toString()}</div>
            <button onClick={startInstance}>
                START
            </button>
            <button onClick={stopInstance}>
                STOP
            </button>
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
