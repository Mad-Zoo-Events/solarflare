import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { DragonPreset } from "../../../domain/presets";
import RemoveEffectButton from "../RemoveEffectButton";
import "./DragonFragment.scss";

interface DragonFragmentProps {
    preset: DragonPreset
    control: Control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any
}

const DragonFragment = ({
    preset,
    register,
    control
}: DragonFragmentProps): ReactElement => {
    preset.dragonEffects = preset.dragonEffects || [{ pointId: 0, static: false }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "dragonEffects"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">List of dragons</div>

            <div className="add-button" onClick={() => prepend({ ...preset.dragonEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" title="Add Another Effect" />
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__dragon-item preset-modifier__item">
                            <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

                            <label className="point-label">Point ID</label>
                            <input
                                className="point-input"
                                name={`dragonEffects[${index}].pointId`}
                                type="number"
                                defaultValue={effect.pointId}
                                ref={register()}
                            />

                            <label className="checkbox-container static-checkbox">Static
                                <input
                                    name={`dragonEffects[${index}].static`}
                                    type="checkbox"
                                    defaultChecked={effect.static}
                                    ref={register()}
                                />
                                <span></span>
                            </label>
                        </div>
                    );
                })
            }
        </>
    );
};

export default DragonFragment;
