import React, { ReactElement } from "react";
import { LightningPreset } from "../../../../domain/presets";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const LightningFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const lightningPreset = preset as LightningPreset;
    const { pointIDList } = lightningPreset;

    const { register } = formMethods;

    return (
        <>
            <div className="subtitle">
                <span>Lightnings</span>
            </div>
            <label className="pointids-label" >
                       Comma-separated list of point IDs
            </label>
            <input
                className="pointids-input"
                name={"pointIDList"}
                type="text"
                defaultValue={pointIDList}
                ref={register()}
            />
        </>
    );
};

export default LightningFragment;
