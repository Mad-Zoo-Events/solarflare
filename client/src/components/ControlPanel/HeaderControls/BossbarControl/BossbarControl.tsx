import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, ReactElement, useState } from "react";
import { connect } from "react-redux";
import BossbarColor from "../../../../domain/controlpanel/BossbarColor";
import { RootState } from "../../../../RootState";
import { clearBossbar, setIgnoreKeystrokes, updateBossbar } from "../../ControlPanelActions";
import { selectBossbarColor, selectBossbarText } from "../../ControlPanelSelectors";
import "./BossbarControl.scss";
import { BossbarControlProps } from "./BossbarControlProps";
import BossbarPreview from "./BossbarPreview";

const BossbarControls = ({
    title,
    color,
    updateBossbar,
    clearBossbar,
    setIgnoreKeystrokes
}: BossbarControlProps): ReactElement => {
    const [autoUpdate, setAutoUpdate] = useState(true);

    const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        updateBossbar({
            color: e.currentTarget.value as BossbarColor,
            title
        }, autoUpdate);
    };

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const title = e.currentTarget.value;
        updateBossbar({
            color,
            title
        }, autoUpdate && !title.endsWith("§"));
    };

    return (
        <div className="control-panel__bossbar-control">
            <FontAwesomeIcon icon={["fas", "skull"]} size="2x"/>
            <input
                type="text"
                placeholder="Now Playing: Bob Ross"
                value={title}
                onFocus={() => setIgnoreKeystrokes(true)}
                onBlur={() => setIgnoreKeystrokes(false)}
                onChange={handleTitleChange}
            />
            <div className="code bossbar-preview fake-input">
                <BossbarPreview rawText={title} />
            </div>
            <select
                value={color}
                onChange={handleColorChange}
            >
                {Object.values(BossbarColor).map(key =>
                    <option key={key} value={key}>{key as BossbarColor}</option>
                )}
            </select>
            {!autoUpdate && <FontAwesomeIcon
                className="button"
                icon={["fas", "paper-plane"]} size="2x"
                onClick={() => updateBossbar({ color, title }, true)}
                title="Set Boss Bar"
            />}
            <FontAwesomeIcon
                className="button"
                icon={["far", "eye-slash"]} size="2x"
                onClick={clearBossbar}
                title="Hide Boss Bar"
            />
            <label className="checkbox-container">
                Update Live
                <input
                    type="checkbox"
                    checked={autoUpdate}
                    onChange={(e) => setAutoUpdate(e.currentTarget.checked)}
                />
                <span></span>
            </label>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const title = selectBossbarText(state);
    const color = selectBossbarColor(state);

    return {
        title,
        color
    };
}

const mapDispatchToProps = {
    setIgnoreKeystrokes: setIgnoreKeystrokes,
    updateBossbar: updateBossbar,
    clearBossbar: clearBossbar
};

export default connect(mapStateToProps, mapDispatchToProps)(BossbarControls);
