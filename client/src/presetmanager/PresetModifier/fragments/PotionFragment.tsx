import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { PotionEffectTypes, PotionPreset } from "../../../domain/presets/PotionPreset";
import { getOnChangeInt } from "../../../utils/utils";
import RemoveEffectButton from "../RemoveEffectButton";
import "./PotionFragment.scss";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const PotionFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const potionPreset = preset as PotionPreset;
    potionPreset.potionEffects = potionPreset.potionEffects || [{ type: "BLINDNESS", amplifier: 1 }];

    const { register, control, setValue } = formMethods;

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "potionEffects"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">List of potion effects</div>

            <div className="add-button" onClick={() => prepend({ ...potionPreset.potionEffects[0] })}>
                <FontAwesomeIcon icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => (
                    <div key={effect.id} className="preset-modifier__potion-item preset-modifier__item">
                        <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

                        <label className="type-label">Potion Effect #{index + 1}</label>
                        <select name={`potionEffects[${index}].type`} defaultValue={effect.type} ref={register()}>
                            {Object.keys(PotionEffectTypes).map(key => (
                                <Fragment key={key}>
                                    <option value={key}>{key}</option>
                                    <option disabled>&nbsp;&nbsp;└─ {PotionEffectTypes[key]}</option>
                                </Fragment>
                            ))}
                        </select>

                        <label className="amplifier-label">Amplifier</label>
                        <Controller
                            name={`potionEffects[${index}].amplifier`}
                            control={control}
                            as={<input type="hidden"/>}
                            defaultValue={effect.amplifier}
                        />

                        <input
                            type="number"
                            defaultValue={effect.amplifier}
                            onChange={(e) => setValue(`potionEffects[${index}].amplifier`, getOnChangeInt(e))}
                        />
                    </div>
                ))
            }
        </>
    );
};

export default PotionFragment;
