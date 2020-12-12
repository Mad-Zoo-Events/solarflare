import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { LaserPreset } from "../../../domain/presets";
import { LaserTypes } from "../../../domain/presets/LaserPreset";
import { getOnChangeInt } from "../../../utils/utils";
import RemoveEffectButton from "../RemoveEffectButton";
import "./LaserFragment.scss";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const LaserFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const laserPreset = preset as LaserPreset;
    laserPreset.laserEffects = laserPreset.laserEffects || [{ start: 0, end: 0 }];

    const { register, control, setValue, watch } = formMethods;

    const isTargetingLaser = watch("laserType", laserPreset.laserType) === "targetingGuardian";

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "laserEffects"
    });

    return (
        <>
            <div className="subtitle">Settings</div>

            <div className="preset-modifier__common-inputs">
                <label>Laser Type</label>
                <select name="laserType" defaultValue={laserPreset.laserType} ref={register}>
                    {Object.keys(LaserTypes).map(key => (
                        <Fragment key={key}>
                            <option value={key}>{LaserTypes[key]}</option>
                        </Fragment>
                    ))}
                </select>
            </div>

            <div className="subtitle">
                <span>List of lasers</span>
                <div className="add-button" onClick={() => prepend({ ...laserPreset.laserEffects[0] })} >
                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" title="Add Another Effect" />
                </div>
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__laser-item preset-modifier__item">
                            <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

                            <label className="start-label">Start point ID</label>
                            <Controller
                                name={`laserEffects[${index}].start`}
                                control={control}
                                as={<input type="hidden"/>}
                                defaultValue={effect.start}
                            />

                            <input
                                className="start-point"
                                type="number"
                                defaultValue={effect.start}
                                onChange={(e) => setValue(`laserEffects[${index}].start`, getOnChangeInt(e))}
                            />

                            {isTargetingLaser || <>
                                <label className="destination-label">Destination point ID</label>
                                <Controller
                                    name={`laserEffects[${index}].end`}
                                    control={control}
                                    as={<input type="hidden"/>}
                                    defaultValue={effect.end}
                                />

                                <input
                                    className="destination-point"
                                    type="number"
                                    defaultValue={effect.end}
                                    onChange={(e) => setValue(`laserEffects[${index}].end`, getOnChangeInt(e))}
                                />
                            </>}
                        </div>
                    );
                })
            }
        </>
    );
};

export default LaserFragment;
