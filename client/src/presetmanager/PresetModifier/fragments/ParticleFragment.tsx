import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { Controller, useFieldArray } from "react-hook-form";
import { ParticlePreset } from "../../../domain/presets";
import { ParticleEffectRegionTypes, ParticleEffectTypes } from "../../../domain/presets/ParticlePreset";
import { getOnChangeFloat, getOnChangeInt } from "../../../utils/utils";
import RemoveEffectButton from "../RemoveEffectButton";
import "./ParticleFragment.scss";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const ParticleFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const particlePreset = preset as ParticlePreset;
    particlePreset.particleEffects = particlePreset.particleEffects || [{
        name: "ASH",
        regionType: "POINTS",
        pointIDList: "",
        density: 20
    }];

    const { register, control, watch, setValue } = formMethods;

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "particleEffects"
    });

    const fromColorDto = (color: string): RGBColor => {
        const parts = color.split(",").map(Number);
        return {
            r: parts[0], g: parts[1], b: parts[2]
        };
    };

    const toColorDto = ({ r, g, b }: RGBColor): string => (
        `${r},${g},${b}`
    );

    const onColorChange = ({ rgb }: ColorResult, index: number) => {
        setValue(`particleEffects[${index}].dustColor`, toColorDto(rgb));
    };

    return (
        <>
            <div className="preset-modifier__subtitle">List of particle effects</div>

            <div className="add-button" onClick={() => prepend({ ...particlePreset.particleEffects[0] })} >
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" title="Add Another Effect" />
            </div>
            {
                fields.map((effect, index) => {
                    const regionType = watch(`particleEffects[${index}].regionType`, particlePreset.particleEffects[0].regionType);
                    const effectName = watch(`particleEffects[${index}].name`, particlePreset.particleEffects[0].name);
                    const dustColor = watch(`particleEffects[${index}].dustColor`, "0,0,0");

                    return (
                        <div key={effect.id} className="preset-modifier__particle-item preset-modifier__item">
                            <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

                            <label className="effect-label">Effect #{index + 1}</label>
                            <select className="effect-input" name={`particleEffects[${index}].name`} defaultValue={effect.name} ref={register()}>
                                {ParticleEffectTypes.map(name => (
                                    <Fragment key={name}>
                                        <option value={name}>
                                            {name}
                                            {["ITEM_CRACK", "BLOCK_CRACK", "BLOCK_DUST", "FALLING_DUST", "REDSTONE"].includes(name) && " *"}
                                        </option>
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
                                <Controller
                                    name={`particleEffects[${index}].density`}
                                    control={control}
                                    as={<input type="hidden"/>}
                                    defaultValue={effect.density}
                                />

                                <input
                                    name={`particleEffects[${index}].numberdensity`}
                                    className="density-number-input"
                                    type="number"
                                    min={1} max={100} step={0.1}
                                    defaultValue={effect.density}
                                    ref={register()}
                                    onChange={(e) => {
                                        const density = getOnChangeFloat(e);
                                        setValue(`particleEffects[${index}].density`, density);
                                        setValue(`particleEffects[${index}].rangedensity`, density);
                                    }}
                                />

                                <input
                                    name={`particleEffects[${index}].rangedensity`}
                                    className="density-range-input"
                                    type="range"
                                    min={1} max={100} step={0.1}
                                    defaultValue={effect.density}
                                    ref={register()}
                                    onChange={(e) => {
                                        const density = getOnChangeInt(e);
                                        setValue(`particleEffects[${index}].density`, density);
                                        setValue(`particleEffects[${index}].numberdensity`, density);
                                    }}
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

                            {effectName === "REDSTONE" &&
                                <>
                                    <label className="dustsize-label">Particle Size</label>
                                    <Controller
                                        name={`particleEffects[${index}].dustSize`}
                                        control={control}
                                        as={<input type="hidden"/>}
                                        defaultValue={effect.dustSize || 1.0}
                                    />

                                    <input
                                        className="dustsize-input"
                                        name={`particleEffects[${index}].numberDustSize`}
                                        type="number"
                                        step={0.1}
                                        defaultValue={effect.dustSize}
                                        ref={register()}
                                        onChange={(e) => {
                                            const density = getOnChangeFloat(e);
                                            setValue(`particleEffects[${index}].dustSize`, density);
                                        }}
                                    />

                                    <label className="color-label">Particle Color</label>
                                    <Controller
                                        name={`particleEffects[${index}].dustColor`}
                                        control={control}
                                        as={<input type="hidden"/>}
                                        defaultValue={effect.dustColor || "0,0,0"}
                                    />

                                    <SketchPicker
                                        className="color-input"
                                        presetColors={[]}
                                        color={fromColorDto(dustColor)}
                                        onChange={(color) => onColorChange(color, index)}
                                        disableAlpha={true}
                                    />
                                </>
                            }

                            {["ITEM_CRACK", "BLOCK_CRACK", "BLOCK_DUST", "FALLING_DUST"].includes(effectName) &&
                                <>
                                    <label className="material-label">
                                        Material ID&nbsp;
                                        <a target="_blank" rel="noreferrer" href="https://www.digminecraft.com/lists/item_id_list_pc.php">See Here</a>
                                    </label>
                                    <input
                                        className="material-input"
                                        name={`particleEffects[${index}].dustColor`}
                                        type="text"
                                        placeholder="minecraft:magma_block"
                                        ref={register()}
                                    />
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
