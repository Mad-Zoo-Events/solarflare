import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { TimeshiftPreset } from "../../domain/presets";
import { getOnChangeNumber } from "../../utils/utils";
import "./TimeshiftFragment.scss";

interface TimeshiftFragmentProps {
    preset: TimeshiftPreset
    register: any
    control: any
    setValue: any
}

const TimeshiftFragment = ({
    preset,
    register,
    control,
    setValue
}:TimeshiftFragmentProps) => {
    preset.timeshiftEffects = preset.timeshiftEffects || [{ amount: 100 }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "timeshiftEffects"
    });

    return (
        <>
            <div className="add-button" onClick={() => prepend({ ...preset.timeshiftEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="2x" />
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__timeshift-item">
                            <FontAwesomeIcon className="delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => remove(index)} />
                            <label>Amount #{index + 1}</label>
                            <input
                                name={`timeshiftEffects[${index}].amount`}
                                type="number"
                                min={-12000}
                                max={12000}
                                step={1}
                                defaultValue={effect.amount}
                                ref={register()}
                                onChange={(e) => setValue(`timeshiftEffects[${index}].rangeamount`, getOnChangeNumber(e))}
                            />
                            <input
                                name={`timeshiftEffects[${index}].rangeamount`}
                                type="range"
                                min={-12000}
                                max={12000}
                                step={10}
                                defaultValue={effect.amount}
                                ref={register()}
                                onChange={(e) => setValue(`timeshiftEffects[${index}].amount`, getOnChangeNumber(e))}
                            />
                        </div>
                    );
                })
            }
        </>
    );
};

export default TimeshiftFragment;
