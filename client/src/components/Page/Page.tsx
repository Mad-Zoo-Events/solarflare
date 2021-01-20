import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { selectIsInitialized, selectVersion } from "../../AppSelectors";
import { RootState } from "../../RootState";
import Routes from "../../routes";
import Spinner from "../Spinner/Spinner";
import "./Page.scss";
import { PageProps } from "./PageProps";

const Page = ({
    isControlPanel,
    headerElements,
    children,
    footerElements,
    isInitialized,
    version
}: PageProps): ReactElement => (
    <>
        <ToastContainer />
        {!isInitialized && <Spinner fullScreen/>}
        <div className="page">
            {isControlPanel
                ? <div className="page-header">
                    <div className="additional-header-elements">{headerElements}</div>
                </div>
                : <div className="page-header presetmanager-header">
                    <Link className="button nav-button" to={Routes.controlPanel} title="Back To Control Panel">
                        <FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />
                    </Link>

                    <div className="text">Preset Management System</div>

                    <div className="additional-header-elements">{headerElements}</div>
                </div>
            }

            <div className="page-content">
                {children}
            </div>

            <div className="page-footer">
                <div className="additional-footer-elements">{footerElements}</div>
                <div className="status-bar">App Version: {version}</div>
            </div>
        </div>
    </>
);

function mapStateToProps (state: RootState) {
    const isInitialized = selectIsInitialized(state);
    const version = selectVersion(state);

    return {
        isInitialized,
        version
    };
}

export default connect(mapStateToProps, {})(Page);
