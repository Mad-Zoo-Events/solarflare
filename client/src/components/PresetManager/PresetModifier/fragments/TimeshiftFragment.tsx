import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { useFieldArray } from "react-hook-form";
import { TimeshiftPreset } from "../../../../domain/presets";
import { getOnChangeInt } from "../../../../utils/utils";
import RemoveEffectButton from "../RemoveEffectButton";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";
import "./TimeshiftFragment.scss";

const TimeshiftFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const timeshiftPreset = preset as TimeshiftPreset;
    timeshiftPreset.timeshiftEffects = timeshiftPreset.timeshiftEffects || [{ amount: 100 }];

    const { register, control, setValue } = formMethods;

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "timeshiftEffects"
    });

    return (
        <>
            <div className="subtitle">
                <span>List of timeshift effects</span>
                <div className="add-button" onClick={() => prepend({ ...timeshiftPreset.timeshiftEffects[0] })} >
                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" title="Add Another Effect" />
                </div>
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__timeshift-item preset-modifier__item">
                            <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index} />

                            <label>Amount #{index + 1}</label>
                            <input
                                name={`timeshiftEffects[${index}].amount`}
                                type="number"
                                min={-12000} max={12000} step={1}
                                defaultValue={effect.amount}
                                ref={register({ valueAsNumber: true })}
                                onChange={(e) => {
                                    setValue(`timeshiftEffects[${index}].rangeamount`, getOnChangeInt(e));
                                }}
                            />

                            <input
                                name={`timeshiftEffects[${index}].rangeamount`}
                                type="range"
                                min={-12000} max={12000} step={10}
                                defaultValue={effect.amount}
                                ref={register({ valueAsNumber: true })}
                                onChange={(e) => {
                                    setValue(`timeshiftEffects[${index}].amount`, getOnChangeInt(e));
                                }}
                            />
                        </div>
                    );
                })
            }
        </>
    );
};

export default TimeshiftFragment;
