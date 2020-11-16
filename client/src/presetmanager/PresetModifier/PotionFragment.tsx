import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { useFieldArray } from "react-hook-form";
import { PotionEffectTypes, PotionPreset } from "../../domain/presets/PotionPreset";

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

    return (
        <>
            <FontAwesomeIcon icon={["fas", "plus-circle"]} size="lg" onClick={() => prepend({ ...preset.potionEffects[0] })} />
            {
                fields.map((effect, index) => (
                    <div key={effect.id}>
                        <FontAwesomeIcon icon={["far", "trash-alt"]} size="2x" onClick={() => remove(index)} />
                        <label>Potion Effect
                            <select name={`potionEffects[${index}].type`} defaultValue={effect.type} ref={register()}>
                                {Object.keys(PotionEffectTypes).map(key => (
                                    <Fragment key={key}>
                                        <option value={key}>{key}</option>
                                        <option disabled>&nbsp;&nbsp;└─ {PotionEffectTypes[key]}</option>
                                    </Fragment>
                                ))}
                            </select>
                        </label>
                        <label>Amplifier
                            <input name={`potionEffects[${index}].amplifier`} type="number" defaultValue={effect.amplifier} ref={register()}/>
                        </label>
                        < br/>
                    </div>
                ))
            }
        </>
    );
};

export default PotionFragment;
