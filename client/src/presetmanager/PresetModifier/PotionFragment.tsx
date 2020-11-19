import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { useFieldArray } from "react-hook-form";
import { PotionEffectTypes, PotionPreset } from "../../domain/presets/PotionPreset";
import "./PotionFragment.scss";

interface PotionFragmentProps {
    preset: PotionPreset
    register: any
    control: any
}

const PotionFragment = ({
    preset,
    register,
    control
}: PotionFragmentProps) => {
    preset.potionEffects = preset.potionEffects || [{ type: "BLINDNESS", amplifier: 2 }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "potionEffects"
    });

    const removeEffect = (index: number) => {
        fields.length > 1 ? remove(index) : alert("Gotta keep at least one effect");
    };

    return (
        <>
            <div className="add-button" onClick={() => prepend({ ...preset.potionEffects[0] })}>
                <FontAwesomeIcon icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => (
                    <div key={effect.id} className="preset-modifier__potion-item">
                        <FontAwesomeIcon className="delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => removeEffect(index)} />
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
                        < br/>
                    </div>
                ))
            }
        </>
    );
};

export default PotionFragment;
