import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { useFieldArray } from "react-hook-form";
import { PotionEffectTypes, PotionPreset } from "../../../domain/presets/PotionPreset";
import RemoveEffectButton from "../RemoveEffectButton";
import "./PotionFragment.scss";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const PotionFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const potionPreset = preset as PotionPreset;
    potionPreset.potionEffects = potionPreset.potionEffects || [{ type: "BLINDNESS", amplifier: 1 }];

    const { register, control } = formMethods;

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "potionEffects"
    });

    return (
        <>
            <div className="subtitle">
                <span>List of potion effects</span>
                <div className="add-button" onClick={() => prepend({ ...potionPreset.potionEffects[0] })}>
                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" title="Add Another Effect" />
                </div>
            </div>
            {
                fields.map((effect, index) => (
                    <div key={effect.id} className="preset-modifier__potion-item preset-modifier__item">
                        <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index} />

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
                        <input
                            className="amplifier-input"
                            name={`potionEffects[${index}].amplifier`}
                            type="number"
                            defaultValue={effect.amplifier}
                            ref={register({ valueAsNumber: true })}
                        />
                    </div>
                ))
            }
        </>
    );
};

export default PotionFragment;
