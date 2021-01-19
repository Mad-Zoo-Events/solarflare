import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, ReactElement, useState } from "react";
import { connect } from "react-redux";
import BossbarColor from "../../../../domain/controlpanel/BossbarColor";
import { FormattingMap } from "../../../../domain/controlpanel/BossbarFormatting";
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
    const [isOpen, setIsOpen] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);

    const handleMouseOver = () => setMouseOver(true);
    const handleMouseOut = () => setMouseOver(false);
    const handleFocus = () => setIgnoreKeystrokes(true);
    const handleBlur = () => { setIgnoreKeystrokes(false); if (!mouseOver) setIsOpen(false); };

    const endsWithFormattingCode = (s: string) => s.match(/^(§.{1}|§)+$/g);

    const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => updateBossbar({
        color: e.currentTarget.value as BossbarColor,
        title
    }, autoUpdate);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => updateBossbar({
        color,
        title: e.currentTarget.value
    }, autoUpdate && !endsWithFormattingCode(e.currentTarget.value));

    const preview = title.length === 0 || endsWithFormattingCode(title)
        ? <input className="bossbar-preview" type="text" placeholder="Now Playing: Bob Ross"/>
        : <div className="code bossbar-preview fake-input">
            <BossbarPreview rawText={title} />
        </div>;

    const input = <input
        type="text"
        spellCheck={false}
        placeholder="Now Playing: Bob Ross"
        defaultValue={title}

        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleFocus}
        onBlur={handleBlur}

        onChange={handleTitleChange}
        autoFocus
    />;

    return (
        <div className="control-panel__bossbar-control">
            <FontAwesomeIcon icon={["fas", "skull"]} size="2x"/>

            <div>
                <div
                    className="button popup-label"
                    tabIndex={1}
                    onClick={() => { setIgnoreKeystrokes(true); setIsOpen(true); }}
                >
                    {isOpen ? input : preview}
                </div>
                <div
                    className="popup-holder"
                    tabIndex={1}

                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                >
                    <div className={`popup-content bossbar-popup-content ${isOpen ? "show-popup" : ""}`}>
                        {preview}
                        <div className="formatting-group">
                            <div><div>▼</div><div>Choose color</div></div>
                            {Array.from(FormattingMap).map(([token, format]) => {
                                if (format.kind === "decoration") return null;
                                return <div key={token}>
                                    <div>{token}</div>
                                    <div style={format.style}>{format.name}</div>
                                </div>;
                            })}
                        </div>
                        <div className="formatting-group">
                            <div><div>▼</div><div>Then formatting</div></div>
                            {Array.from(FormattingMap).map(([token, format]) => {
                                if (format.kind === "color") return null;
                                return <div key={token}>
                                    <div>{token}</div>
                                    <div style={format.style}>{format.name}</div>
                                </div>;
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <select value={color}onChange={handleColorChange}>
                {Object.values(BossbarColor).map(key =>
                    <option key={key} value={key}>{key as BossbarColor}</option>
                )}
            </select>

            <div>
                {!autoUpdate && <FontAwesomeIcon
                    className="button update-button"
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
            </div>

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
