import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement, useState } from "react";
import "./Submenu.scss";
import { SubmenuProps } from "./SubmenuProps";

const Submenu = ({
    label,
    iconProps,
    multiselect,
    options,
    onChange
}: SubmenuProps): ReactElement => {
    const getSelected = () => {
        const selected: string[] = [];
        options.forEach(o => { o.selected && selected.push(o.value); });
        return selected;
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
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
                                <div className="button option">
                                    <label key={value} className="checkbox-container">{text}
                                        <input
                                            type="checkbox"
                                            defaultChecked={selected}
                                            onChange={(e) => {
                                                option.selected = e.currentTarget.checked;
                                                onChange(getSelected());
                                            }}
                                        />
                                        <span></span>
                                    </label>
                                </div>
                            );
                        }

                        return (
                            <div key={value} className="button option" onClick={() => onChange([value])}>
                                {text}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Submenu;
