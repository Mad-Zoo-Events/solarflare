import React from "react";
import { Link } from "react-router-dom";
import Routes from "../routes";

const ControlPanel = () => {
    return (
        <Link to={Routes.presetManager}>Manage Presets</Link>
    );
};

export default ControlPanel;
