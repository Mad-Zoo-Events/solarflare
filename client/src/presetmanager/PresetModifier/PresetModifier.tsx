import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { connect } from "react-redux";
import * as et from "../../domain/EffectType";
import { CommandPreset, DragonPreset, LaserPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "../../domain/presets";
import { MidiBehaviorTypes } from "../../domain/presets/IPreset";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";
import { getAccentColor, getOnChangeInt, getShortcutCode, getShortcutString } from "../../utils/utils";
import { closePresetModifier, upsertPreset } from "../PresetManagerActions";
import { CommandFragment, DragonFragment, LaserFragment, ParticleFragment, PotionFragment, TimeshiftFragment } from "./fragments";
import "./PresetModifier.scss";
import ProgressBar from "react-customizable-progressbar";
import { PresetModifierProps } from "./PresetModifierProps";

const PresetModifier = ({
    preset,
    effectType,
    onClose,
    onSubmitForm
}: PresetModifierProps): ReactElement => {
    preset = preset || { id: "", displayName: "", keyBinding: 0 };
    preset.keyBindingStr = getShortcutString(preset.keyBinding);
    const accentColor = getAccentColor(effectType);
    const coloredShadow = { boxShadow: `0 0 8em var(--darker-${accentColor})` };

    const newMidiMapping = () => ({ channel: 1, key: 1, behavior: "trigger" });

    const formMethods = useForm<Preset>({
        defaultValues: preset
    });

    const { register, handleSubmit, control, setValue } = formMethods;

    const onSubmit = (preset: Preset) => {
        onSubmitForm(effectType, preset);
    };

    const specificInputs = () => {
        switch (effectType) {
        case et.Command:
            return <CommandFragment preset={preset as CommandPreset} formMethods={formMethods} />;
        case et.Dragon:
            return <DragonFragment preset={preset as DragonPreset} formMethods={formMethods} />;
        case et.Laser:
            return <LaserFragment preset={preset as LaserPreset} formMethods={formMethods} />;
        case et.Particle:
            return <ParticleFragment preset={preset as ParticlePreset} formMethods={formMethods} />;
        case et.Potion:
            return <PotionFragment preset={preset as PotionPreset} formMethods={formMethods} />;
        case et.Timeshift:
            return <TimeshiftFragment preset={preset as TimeshiftPreset} formMethods={formMethods} />;
        }
    };

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "midiMappings"
    });

    const handleShortcutKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.key;
        event.currentTarget.value = input;
        setValue("keyBinding", getShortcutCode(input));
    };

    const handleShortcutPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.clipboardData.getData("text")[0];
        event.currentTarget.value = input;
        setValue("keyBinding", getShortcutCode(input));
    };

    const [testProgress, setTestProgress] = useState(0);
    useEffect(() => {
        if (testProgress > 0) {
            setTimeout(() => {
                setTestProgress(testProgress - 3.33333);
            }, 100);
        }
    });

    const startTest = () => {
        setTestProgress(90);
    };

    return (
        <div className="preset-modifier__popup">
            <div className="preset-modifier__popup-inner" style={coloredShadow}>
                <div className="header">
                    {preset.id ? <> Edit <span className="preset-name">{preset.displayName}</span> </> : "Create New Preset"}
                    <FontAwesomeIcon className="close-button" icon={["fas", "window-close"]} size="lg" onClick={onClose} title="Close Without Saving" />
                </div>

                <div className="content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="common-inputs">
                            <input name="id" type="hidden" ref={register} />

                            <label>Display Name</label>
                            <input name="displayName" type="text" autoComplete="false" placeholder="Preset display name" ref={register} />

                            <label>Description</label>
                            <input name="description" type="text" autoComplete="false" placeholder="Short description" ref={register} />

                            <label>Keyboard Shortcut</label>
                            <input type="text" autoComplete="false" defaultValue={preset.keyBindingStr} onKeyPress={handleShortcutKeyPress} onPaste={handleShortcutPaste} />
                            <Controller
                                name="keyBinding"
                                control={control}
                                onChange={getOnChangeInt}
                                as={<input type="hidden"/>}
                                defaultValue={preset.keyBinding || 0}
                            />
                        </div>
                        <div>
                            <div className="subtitle">List of MIDI mappings</div>
                            <div>
                                <div className="add-button" onClick={() => prepend(newMidiMapping())}>
                                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="lg" title="Add MIDI Mapping"/>
                                </div>
                                {
                                    fields.map((mapping, index) => (
                                        <div key={mapping.id} className="midi-mapping">
                                            <FontAwesomeIcon className="delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => remove(index)} title="Remove MIDI Mapping" />
                                            <label>Key</label>
                                            <input name={`midiMappings[${index}].key`} type="number" defaultValue={mapping.key} ref={register()} />

                                            <label>Channel</label>
                                            <input name={`midiMappings[${index}].channel`} type="number" defaultValue={mapping.channel} ref={register()} />

                                            <label>Behavior</label>
                                            <select name={`midiMappings[${index}].behavior`} defaultValue={mapping.behavior} ref={register()}>
                                                {Object.keys(MidiBehaviorTypes).map(key => (
                                                    <Fragment key={key}>
                                                        <option value={key}>{key}</option>
                                                        <option disabled>&nbsp;&nbsp;└─ {MidiBehaviorTypes[key]}</option>
                                                    </Fragment>
                                                ))}
                                            </select>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {specificInputs()}
                    </form>
                </div>
                <div className="footer">
                    <div className="test-button" onClick={startTest} >
                        <span>Test</span>
                        {testProgress > 0
                            ? <ProgressBar
                                className="progress-circle"
                                radius={10}
                                strokeWidth={3}
                                strokeColor="#00aba9"
                                strokeLinecap="square"
                                trackStrokeWidth={3}
                                progress={testProgress}
                            />
                            : <FontAwesomeIcon icon={["fas", "vial"]} size="lg" title="Run This Preset For Three Seconds" />
                        }
                    </div>
                    <div className="save-button" onClick={handleSubmit(onSubmit)}>
                        <span>Save</span>
                        <FontAwesomeIcon icon={["fas", "save"]} size="lg" title="Save This Preset" />
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    if (!state.presetmanager.presetToEdit) {
        return;
    }

    const { effectType, preset } = state.presetmanager.presetToEdit;

    return {
        preset,
        effectType
    };
}

const mapDispatchToProps = {
    onClose: closePresetModifier,
    onSubmitForm: upsertPreset
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetModifier);
