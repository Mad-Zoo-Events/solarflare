import React, { Fragment, useState } from "react";
import { TimeshiftPreset } from "../../domain/presets";
import { getOnChangeNumber } from "../../utils/utils";

interface TimeshiftFragmentProps {
    preset: TimeshiftPreset
    register: any
}

const TimeshiftFragment = ({
    preset,
    register
}:TimeshiftFragmentProps) => {
    preset.timeshiftEffects = preset.timeshiftEffects || [{ amount: 100 }];

    return (
        <>
            {preset.timeshiftEffects.map((timeshiftEffect, index) => {
                const [amount, setAmount] = useState(timeshiftEffect.amount);

                return (
                    <Fragment key={index}>
                        <label>Amount
                            <input
                                name={`timeshiftEffects[${index}]`}
                                type="hidden"
                                value={amount}
                                ref={register}
                            />
                            <input
                                type="number"
                                min={-12000}
                                max={12000}
                                step={1}
                                value={amount}
                                onInput={(e) => setAmount(getOnChangeNumber(e))}
                            />
                            <input
                                type="range"
                                min={-12000}
                                max={12000}
                                step={10}
                                value={amount}
                                onInput={(e) => setAmount(getOnChangeNumber(e))}
                            />
                        </label>
                    </Fragment>
                );
            })}
        </>
    );
};

export default TimeshiftFragment;
