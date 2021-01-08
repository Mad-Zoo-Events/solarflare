import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { stopAll } from "../ControlPanelActions";
import "./FooterControls.scss";
import { FooterControlsProps } from "./FooterControlsProps";

const FooterControls = ({
    stopAll
}: FooterControlsProps): ReactElement => {
    return (
        <div className="control-panel__footer-controls">
            <div className="stop-buttons">
                <FontAwesomeIcon
                    className="button stop-effects"
                    icon={["far", "stop-circle"]}
                    size="3x"
                    title="Stop Effects"
                    onClick={() => stopAll({ stopEffects: true, detachClocks: false })}
                />
                <FontAwesomeIcon
                    className="button detach-clocks"
                    icon={["fas", "stopwatch"]}
                    size="3x"
                    title="Detach Clocks"
                    onClick={() => stopAll({ stopEffects: false, detachClocks: true })}
                />
                <FontAwesomeIcon
                    className="button stop-everything"
                    icon={["fas", "stop-circle"]}
                    size="3x"
                    title="Stop Effects + Detach Clocks"
                    onClick={() => stopAll({ stopEffects: true, detachClocks: true })}
                />
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    stopAll: stopAll
};

export default connect(null, mapDispatchToProps)(FooterControls);
