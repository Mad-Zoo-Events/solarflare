import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import Routes from "../routes";

const ControlPanel = (): ReactElement => {
    return (
        <Link to={Routes.presetManager}>Manage Presets</Link>
    );
};

export default ControlPanel;
