import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import Routes from "../../routes";
import "./PageHeader.scss";
import { PageHeaderProps } from "./PageHeaderProps";

const PageHeader = ({
    isControlPanel
}: PageHeaderProps): ReactElement => {
    return isControlPanel
        ? (
            <div className="page-header">
                <div className="text">Visual Effect Control Panel</div>
                <Link className="button-right" to={Routes.presetManager} title="Manage Presets">
                    <FontAwesomeIcon icon={["fas", "cogs"]} size="lg" />
                </Link>
            </div>
        )
        : (
            <div className="page-header">
                <Link className="button-left" to={Routes.controlPanel} title="Back To Control Panel">
                    <FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />
                </Link>
                <div className="text">Preset Management System</div>
            </div>
        );
};

export default PageHeader;
