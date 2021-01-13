import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement, useState } from "react";
import "./Submenu.scss";
import { Option, SubmenuProps } from "./SubmenuProps";

const Submenu = ({
    label,
    iconProps,
    multiselect,
    options,
    onChange
}: SubmenuProps): ReactElement => {
    const getSelected = () => {
        const selected: Option[] = [];
        options.forEach(o => { o.selected && selected.push(o); });
        return selected;
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="button header-control-label" onClick={() => setIsOpen(!isOpen)}>
                {iconProps && <div><FontAwesomeIcon {...iconProps}/></div>}
                <div>{label}</div>
            </div>
            <div className="popup-holder">
                <div className={`popup-content${isOpen ? " show-popup" : ""}`}>
                    {options.map(option => {
                        const { value, text, selected } = option;
                        if (multiselect) {
                            return (
                                <div key={value} className="button option">
                                    <label className="checkbox-container">{text}
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={(e) => {
                                                option.selected = e.currentTarget.checked;
                                                onChange(option, getSelected());
                                            }}
                                        />
                                        <span></span>
                                    </label>
                                </div>
                            );
                        }

                        return (
                            <div key={value} className="button option">
                                <label className="radio-container">{text}
                                    <input
                                        type="radio"
                                        checked={selected}
                                        onChange={() => onChange(option)}
                                    />
                                    <span></span>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Submenu;