import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { RootState } from "../../RootState";
import Routes from "../../routes";
import "./Page.scss";
import { PageProps } from "./PageProps";

const Page = ({
    isControlPanel,
    headerElements,
    children,
    version
}: PageProps): ReactElement => (
    <div className="page">
        <ToastContainer />

        {isControlPanel
            ? (
                <div className="page-header">
                    <div className="text">Visual Effect Control Panel</div>

                    <div className="additional-elements">{headerElements}</div>

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

                    <div className="additional-elements">{headerElements}</div>
                </div>
            )}

        <div className="page-content">
            {children}
        </div>

        <div className="page-footer">
            <span>App Version: {version}</span>
        </div>
    </div>
);

function mapStateToProps (state: RootState) {
    const { version } = state.app;

    return {
        version
    };
}

export default connect(mapStateToProps, {})(Page);
