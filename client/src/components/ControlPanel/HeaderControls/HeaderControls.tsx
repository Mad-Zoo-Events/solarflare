import React, { ChangeEvent, ReactElement } from "react";
import { connect } from "react-redux";
import { RootState } from "../../../RootState";
import { selectDisplayMode } from "../ControlPanelActions";
import "./HeaderControls.scss";
import { HeaderControlsProps } from "./HeaderControlsProps";

const HeaderControls = ({
    isCategorizedView,
    toggleCategorizedView
}: HeaderControlsProps): ReactElement => {
    const handleCategorizedSwitch = (e: ChangeEvent<HTMLInputElement>) => {
        toggleCategorizedView(e.currentTarget.checked);
    };

    return (
        <div className="control-panel__header-controls">
            <div>
                <label className="checkbox-container">Display Categories
                    <input
                        type="checkbox"
                        defaultChecked={isCategorizedView}
                        onChange={handleCategorizedSwitch}
                    />
                    <span></span>
                </label>
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const isCategorizedView = state.controlpanel.categorize;

    return {
        isCategorizedView
    };
}

const mapDispatchToProps = {
    toggleCategorizedView: selectDisplayMode
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderControls);
