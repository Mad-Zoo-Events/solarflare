import React from "react";
import { Link } from "react-router-dom";
import PresetManagerList from "../components/PresetManagerList";
import Routes from "../routes";

const PresetManager = () => {
    return (
        <>
            <PresetManagerList />
            <Link to={Routes.controlPanel}>Back</Link>
        </>
    );
};

export default PresetManager;
