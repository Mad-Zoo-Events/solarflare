import React, { Fragment } from "react";
import { PotionEffectTypes, PotionPreset } from "../../domain/presets/PotionPreset";

interface PotionFragmentProps {
    preset: PotionPreset
    register: any
}

const PotionFragment = ({
    preset,
    register
}:PotionFragmentProps) => {
    preset.potionEffects = preset.potionEffects || [{ type: PotionEffectTypes[0], amplifier: 1 }];

    return (
        <>
            {preset.potionEffects.map((potion, index) => (
                <Fragment key={index}>
                    <label>Potion Effect
                        <select name={`potionEffects[${index}]type`} ref={register}>
                            {Object.keys(PotionEffectTypes).map(key => (
                                <Fragment key={key}>
                                    <option value={key}>{key}</option>
                                    <option disabled>&nbsp;&nbsp;└─ {PotionEffectTypes[key]}</option>
                                </Fragment>
                            ))}
                        </select>
                    </label>
                    <label>Amplifier
                        <input name={`potionEffects[${index}]amplifier`} type="number" ref={register} />
                    </label>
                </Fragment>
            ))}
        </>
    );
};

export default PotionFragment;
