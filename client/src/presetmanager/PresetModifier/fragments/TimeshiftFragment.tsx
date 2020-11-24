import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { TimeshiftPreset } from "../../../domain/presets";
import { getOnChangeInt } from "../../../utils/utils";
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
            <div className="preset-modifier__subtitle">List of timeshift effects</div>

            <div className="add-button" onClick={() => prepend({ ...timeshiftPreset.timeshiftEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" title="Add Another Effect" />
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__timeshift-item preset-modifier__item">
                            <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

                            <label>Amount #{index + 1}</label>
                            <Controller
                                name={`timeshiftEffects[${index}].amount`}
                                control={control}
                                as={<input type="hidden"/>}
                                defaultValue={effect.amount}
                            />

                            <input
                                name={`timeshiftEffects[${index}].numberamount`}
                                type="number"
                                min={-12000} max={12000} step={1}
                                defaultValue={effect.amount}
                                ref={register()}
                                onChange={(e) => {
                                    const amount = getOnChangeInt(e);
                                    setValue(`timeshiftEffects[${index}].amount`, amount);
                                    setValue(`timeshiftEffects[${index}].rangeamount`, amount);
                                }}
                            />

                            <input
                                name={`timeshiftEffects[${index}].rangeamount`}
                                type="range"
                                min={-12000} max={12000} step={10}
                                defaultValue={effect.amount}
                                ref={register()}
                                onChange={(e) => {
                                    const amount = getOnChangeInt(e);
                                    setValue(`timeshiftEffects[${index}].amount`, amount);
                                    setValue(`timeshiftEffects[${index}].numberamount`, amount);
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
