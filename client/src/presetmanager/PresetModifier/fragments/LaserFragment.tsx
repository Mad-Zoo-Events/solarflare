import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { useFieldArray } from "react-hook-form";
import { LaserPreset } from "../../../domain/presets";
import { LaserTypes } from "../../../domain/presets/LaserPreset";
import RemoveEffectButton from "../RemoveEffectButton";
import "./LaserFragment.scss";

interface LaserFragmentProps {
    preset: LaserPreset
    register: any
    control: any
    watch: any
}

const LaserFragment = ({
    preset,
    register,
    control,
    watch
}: LaserFragmentProps) => {
    preset.laserEffects = preset.laserEffects || [{ start: 0, end: 0 }];

    const isTargetingLaser = watch("laserType", preset.laserType) === "targetingGuardian";

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "laserEffects"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">Settings</div>

            <div className="preset-modifier__common-inputs">
                <label>Laser Type</label>
                <select name="laserType" defaultValue={preset.laserType} ref={register}>
                    {Object.keys(LaserTypes).map(key => (
                        <Fragment key={key}>
                            <option value={key}>{LaserTypes[key]}</option>
                        </Fragment>
                    ))}
                </select>
            </div>

            <div className="preset-modifier__subtitle">List of lasers</div>

            <div className="add-button" onClick={() => prepend({ ...preset.laserEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__laser-item">
                            <RemoveEffectButton fields={fields} remove={remove} index={index}/>

                            <label className="start-label">Start point ID</label>
                            <input
                                className="start-point"
                                name={`laserEffects[${index}].start`}
                                type="number"
                                defaultValue={effect.start}
                                ref={register()}
                            />

                            {isTargetingLaser || <>
                                <label className="destination-label">Destination point ID</label>
                                <input
                                    className="destination-point"
                                    name={`laserEffects[${index}].end`}
                                    type="number"
                                    defaultValue={effect.end}
                                    ref={register()}
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
