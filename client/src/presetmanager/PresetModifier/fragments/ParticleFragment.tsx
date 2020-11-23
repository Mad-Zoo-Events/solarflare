import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment } from "react";
import { useFieldArray } from "react-hook-form";
import { ParticlePreset } from "../../../domain/presets";
import { ParticleEffectRegionTypes, ParticleEffectTypes } from "../../../domain/presets/ParticlePreset";
import { getOnChangeNumber } from "../../../utils/utils";
import RemoveEffectButton from "../RemoveEffectButton";
import "./ParticleFragment.scss";

interface ParticleFragmentProps {
    preset: ParticlePreset
    register: any
    control: any
    watch: any
    setValue: any
}

const ParticleFragment = ({
    preset,
    register,
    control,
    watch,
    setValue
}:ParticleFragmentProps) => {
    preset.particleEffects = preset.particleEffects || [{
        name: ParticleEffectTypes[0],
        regionType: ParticleEffectRegionTypes[0],
        pointIDList: "",
        density: 20
    }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "particleEffects"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">List of particle effects</div>

            <div className="add-button" onClick={() => prepend({ ...preset.particleEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => {
                    const regionType = watch(`particleEffects[${index}].regionType`, preset.particleEffects[0].regionType);

                    return (
                        <div key={effect.id} className="preset-modifier__particle-item preset-modifier__item">
                            <RemoveEffectButton fields={fields} remove={remove} index={index}/>

                            <label className="effect-label">Effect #{index + 1}</label>
                            <select className="effect-input" name={`particleEffects[${index}].name`} defaultValue={effect.name} ref={register()}>
                                {ParticleEffectTypes.map(name => (
                                    <Fragment key={name}>
                                        <option value={name}>{name}</option>
                                    </Fragment>
                                ))}
                            </select>

                            <label className="regiontype-label">Region type</label>
                            <select className="regiontype-input" name={`particleEffects[${index}].regionType`} defaultValue={effect.regionType} ref={register()}>
                                {Object.keys(ParticleEffectRegionTypes).map(key => (
                                    <Fragment key={key}>
                                        <option value={key}>{ParticleEffectRegionTypes[key]}</option>
                                    </Fragment>
                                ))}
                            </select>

                            <label className="pointids-label" >
                                {regionType !== "EQUATION" ? "Comma-separated list of point IDs" : "Origin point ID"}
                            </label>
                            <input
                                className="pointids-input"
                                name={`particleEffects[${index}].pointIDList`}
                                type="text"
                                defaultValue={effect.pointIDList}
                                ref={register()}
                            />

                            {regionType !== "POINTS" &&
                                <label className="checkbox-container randomize-checkbox">Randomize
                                    <input
                                        name={`particleEffects[${index}].randomize`}
                                        type="checkbox"
                                        defaultChecked={effect.randomize}
                                        ref={register()}
                                    />
                                    <span></span>
                                </label>
                            }

                            {regionType !== "POINTS" &&
                            <>
                                <label className="density-label">Density</label>
                                <input
                                    className="density-number-input"
                                    name={`particleEffects[${index}].density`}
                                    type="number"
                                    min={1}
                                    max={100}
                                    step={0.1}
                                    defaultValue={effect.density}
                                    ref={register()}
                                    onChange={(e) => setValue(`particleEffects[${index}].rangedensity`, getOnChangeNumber(e))}
                                />

                                <input
                                    className="density-range-input"
                                    name={`particleEffects[${index}].rangedensity`}
                                    type="range"
                                    min={1}
                                    max={100}
                                    step={0.1}
                                    defaultValue={effect.density}
                                    ref={register()}
                                    onChange={(e) => setValue(`particleEffects[${index}].density`, getOnChangeNumber(e))}
                                />
                            </>
                            }

                            {regionType === "EQUATION" &&
                             <>
                                 <label className="equation-label">Equation</label>
                                 <input
                                     className="equation-input"
                                     name={`particleEffects[${index}].equation`}
                                     type="text"
                                     defaultValue={effect.equation}
                                     ref={register()}
                                     placeholder="50-abs(x+y)-abs(y-x)" />
                             </>
                            }
                        </div>
                    );
                })
            }
        </>
    );
};

export default ParticleFragment;
