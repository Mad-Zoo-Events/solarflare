import React from "react";
import { connect } from "react-redux";
import { selectServers } from "../../../../AppSelectors";
import { RootState } from "../../../../RootState";
import InstanceSetting from "./InstanceSetting/InstanceSetting";
import "./InstanceSettings.scss";
import { InstanceSettingsProps } from "./InstanceSettingsProps";

const InstanceSettings = ({
    servers
}: InstanceSettingsProps) => {
    return (
        <div className="instance-settings">
            {servers.map(server => <InstanceSetting key={server.id} server={server}/>)}
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const servers = selectServers(state);

    return {
        servers
    };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceSettings);
