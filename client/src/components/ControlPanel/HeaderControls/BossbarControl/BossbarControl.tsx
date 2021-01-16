import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, ReactElement, useState } from "react";
import { connect } from "react-redux";
import BossbarColor from "../../../../domain/controlpanel/BossbarColor";
import { RootState } from "../../../../RootState";
import { setIgnoreKeystrokes, updateBossbar } from "../../ControlPanelActions";
import { selectBossbarColor, selectBossbarText } from "../../ControlPanelSelectors";
import "./BossbarControl.scss";
import { BossbarControlProps } from "./BossbarControlProps";
import BossbarPreview from "./BossbarPreview";

const BossbarControls = ({
    text,
    color,
    updateBossbar,
    setIgnoreKeystrokes
}: BossbarControlProps): ReactElement => {
    const [autoUpdate, setAutoUpdate] = useState(true);

    const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
        updateBossbar({
            color: e.currentTarget.value as BossbarColor,
            title: text
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
                value={text}
                onFocus={() => setIgnoreKeystrokes(true)}
                onBlur={() => setIgnoreKeystrokes(false)}
                onChange={handleTitleChange}
            />
            <div className="code bossbar-preview fake-input">
                <BossbarPreview rawText={text} />
            </div>
            <select
                value={color}
                onChange={handleColorChange}
            >
                {Object.values(BossbarColor).map(key =>
                    <option key={key} value={key}>{key as BossbarColor}</option>
                )}
            </select>
            <label className="checkbox-container">Update Immediately
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
    const text = selectBossbarText(state);
    const color = selectBossbarColor(state);

    return {
        text,
        color
    };
}

const mapDispatchToProps = {
    setIgnoreKeystrokes: setIgnoreKeystrokes,
    updateBossbar: updateBossbar
};

export default connect(mapStateToProps, mapDispatchToProps)(BossbarControls);
