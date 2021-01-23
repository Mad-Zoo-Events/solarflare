import React, { ReactElement } from "react";
import "./Submenu.scss";
import { Option, SubmenuProps } from "./SubmenuProps";

const Submenu = ({
    options,
    multiselect,
    onChange
}: SubmenuProps): ReactElement => {
    const getSelected = () => {
        const selected: Option[] = [];
        options.forEach(o => { o.selected && selected.push(o); });
        return selected;
    };

    return (
        <div>
            {options.map(option => {
                const { value, text, selected } = option;
                if (multiselect) {
                    return (
                        <div key={value} className="button submenu-option">
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
                    <div key={value} className="button submenu-option">
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
    );
};

export default Submenu;
