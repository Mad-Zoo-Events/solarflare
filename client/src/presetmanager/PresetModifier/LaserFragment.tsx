import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { LaserPreset } from "../../domain/presets";
import "./LaserFragment.scss";

interface LaserFragmentProps {
    preset: LaserPreset
    register: any
    control: any
    setValue: any
    watch: any
}

const LaserFragment = ({
    preset,
    register,
    control,
    setValue,
    watch
}: LaserFragmentProps) => {
    if (!preset.laserEffects) {
        preset = {
            ...preset,
            isEndLaser: true,
            isNonPlayerTargeting: true,
            laserEffects: [{ startPointId: 0, endPointId: 0 }]
        };
    }

    const isEndLaser = watch("isEndLaser", preset.isEndLaser);
    const isNonPlayerTargeting = watch("isNonPlayerTargeting", preset.isNonPlayerTargeting);

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "laserEffects"
    });

    const removeEffect = (index: number) => {
        fields.length > 1 ? remove(index) : alert("Gotta keep at least one effect");
    };

    return (
        <>
            <div className="preset-modifier__subtitle">Settings</div>

            <label className="checkbox-container">{isEndLaser ? "End Laser" : "Guardian Laser"}
                <input name="isEndLaser" type="checkbox" defaultChecked={preset.isEndLaser} ref={register}/>
                <span className="checkmark"></span>
            </label>
            <br/>

            <label style={{ visibility: isEndLaser ? "collapse" : "visible" }} className="checkbox-container">{isNonPlayerTargeting ? "From Start to End Point" : "Player Targeting"}
                <input name="isNonPlayerTargeting" type="checkbox" defaultChecked={preset.isNonPlayerTargeting} ref={register}/>
                <span className="checkmark"></span>
            </label>

            <div className="preset-modifier__subtitle">List of lasers</div>
            <div className="add-button" onClick={() => prepend({ ...preset.laserEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => {
                    return (
                        <div key={effect.id} className="preset-modifier__laser-item">
                            <FontAwesomeIcon className="delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => removeEffect(index)} />
                            <label>Amount #{index + 1}</label>
                            {/* <input
                                name={`laserEffects[${index}].amount`}
                                type="number"
                                min={-12000}
                                max={12000}
                                step={1}
                                defaultValue={effect.amount}
                                ref={register()}
                                onChange={(e) => setValue(`laserEffects[${index}].rangeamount`, getOnChangeNumber(e))}
                            />
                            <input
                                name={`laserEffects[${index}].rangeamount`}
                                type="range"
                                min={-12000}
                                max={12000}
                                step={10}
                                defaultValue={effect.amount}
                                ref={register()}
                                onChange={(e) => setValue(`laserEffects[${index}].amount`, getOnChangeNumber(e))}
                            /> */}
                        </div>
                    );
                })
            }
        </>
    );
};

export default LaserFragment;
