import React, { ReactElement } from "react";
import PageHeader from "../presetmanager/PageHeader/PageHeader";

const ControlPanel = (): ReactElement => {
    return (
        <PageHeader isControlPanel={true} />
    );
};

export default ControlPanel;
