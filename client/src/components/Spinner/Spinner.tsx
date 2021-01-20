import React, { ReactElement } from "react";
import "./Spinner.scss";

interface SpinnerProps {
    fullScreen?: boolean
}

const Spinner = ({
    fullScreen
}: SpinnerProps): ReactElement => {
    const className = fullScreen ? "fullscreen-container" : "container";
    return (
        <div className={className}>
            <div className="spinner">
                <div className="spinner-item"></div>
                <div className="spinner-item"></div>
                <div className="spinner-item"></div>
            </div>
        </div>
    );
};

export default Spinner;
