import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { DragonPreset } from "../../../domain/presets";
import { getOnChangeInt } from "../../../utils/utils";
import RemoveEffectButton from "../RemoveEffectButton";
import "./DragonFragment.scss";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const DragonFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const dragonPreset = preset as DragonPreset;
    dragonPreset.dragonEffects = dragonPreset.dragonEffects || [{ pointId: 0, static: false }];

    const { control, setValue, register } = formMethods;

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "dragonEffects"
    });

    return (
        <>
            <div className="subtitle">
                <span>List of dragons</span>
                <div className="add-button" onClick={() => prepend({ ...dragonPreset.dragonEffects[0] })} >
                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" title="Add Another Effect" />
                </div>
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__dragon-item preset-modifier__item">
                            <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

                            <label className="point-label">Point ID</label>
                            <Controller
                                name={`dragonEffects[${index}].pointId`}
                                control={control}
                                as={<input type="hidden"/>}
                                defaultValue={effect.pointId}
                            />

                            <input
                                className="point-input"
                                type="number"
                                defaultValue={effect.pointId}
                                onChange={(e) => setValue(`dragonEffects[${index}].pointId`, getOnChangeInt(e))}
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
