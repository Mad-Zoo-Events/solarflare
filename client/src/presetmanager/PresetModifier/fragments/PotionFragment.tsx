import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { PotionEffectTypes, PotionPreset } from "../../../domain/presets/PotionPreset";
import RemoveEffectButton from "../RemoveEffectButton";
import "./PotionFragment.scss";

interface PotionFragmentProps {
    preset: PotionPreset
    control: Control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any
}

const PotionFragment = ({
    preset,
    register,
    control
}: PotionFragmentProps): ReactElement => {
    preset.potionEffects = preset.potionEffects || [{ type: "BLINDNESS", amplifier: 2 }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "potionEffects"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">List of potion effects</div>

            <div className="add-button" onClick={() => prepend({ ...preset.potionEffects[0] })}>
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
                        <input name={`potionEffects[${index}].amplifier`} type="number" defaultValue={effect.amplifier} ref={register()}/>
                    </div>
                ))
            }
        </>
    );
};

export default PotionFragment;
