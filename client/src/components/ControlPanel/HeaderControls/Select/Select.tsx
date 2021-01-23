import React, { ReactElement } from "react";
import "./Select.scss";
import { Option, SelectProps } from "./SelectProps";

const Select = ({
    options,
    multiselect,
    onChange
}: SelectProps): ReactElement => {
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
                        <div key={value} className="button select-option">
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
                    <div key={value} className="button select-option">
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

export default Select;
