import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as et from "../../../domain/EffectType";
import { CommandPreset, DragonPreset, LaserPreset, LightningPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "../../../domain/presets";
import { MidiBehaviorTypes } from "../../../domain/presets/IPreset";
import { Preset } from "../../../domain/presets/Preset";
import { RootState } from "../../../RootState";
import { getAccentColor, getOnChangeInt, getShortcutCode, getShortcutString } from "../../../utils/utils";
import { closePresetModifier, testPreset, upsertPreset } from "../PresetManagerActions";
import { selectPresetToEdit, selectTestIsRunning } from "../PresetManagerSelectors";
import { CommandFragment, DragonFragment, LaserFragment, LightningFragment, ParticleFragment, PotionFragment, TimeshiftFragment } from "./fragments";
import "./PresetModifier.scss";
import { PresetModifierProps } from "./PresetModifierProps";

const PresetModifier = ({
    preset,
    effectType,
    onClose,
    onSubmitForm,
    onTestPreset,
    testIsRunning
}: PresetModifierProps): ReactElement => {
    preset = preset || { id: "", displayName: "", keyBinding: 0 };
    preset.keyBindingStr = getShortcutString(preset.keyBinding);
    const accentColor = getAccentColor(effectType);
    const coloredShadow = { boxShadow: `0 0 8em 0em var(--${accentColor})` };
    if (!preset.midiMappings) {
        preset.midiMappings = [];
    }

    const newMidiMapping = () => ({ channel: 1, key: 1, behavior: "trigger" });

    const formMethods = useForm<Preset>({
        defaultValues: preset
    });

    const { register, handleSubmit, control, setValue } = formMethods;

    const onSubmit = (preset: Preset) => {
        onSubmitForm(effectType, preset);
    };

    const onTest = (preset: Preset) => {
        if (!testIsRunning) {
            toast.dark(effectType === et.Command
                ? "Running commands..."
                : `Running ${effectType} preset for three seconds...`);
            onTestPreset(effectType, preset);
        }
    };

    const specificInputs = () => {
        switch (effectType) {
        case et.Command:
            return <CommandFragment preset={preset as CommandPreset} formMethods={formMethods} />;
        case et.Dragon:
            return <DragonFragment preset={preset as DragonPreset} formMethods={formMethods} />;
        case et.Laser:
            return <LaserFragment preset={preset as LaserPreset} formMethods={formMethods} />;
        case et.Lightning:
            return <LightningFragment preset={preset as LightningPreset} formMethods={formMethods} />;
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

    const handleShortcutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.currentTarget.value === "") {
            setValue("keyBinding", 0);
        }
    };

    const handleShortcutPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const input = event.clipboardData.getData("text")[0];
        event.currentTarget.value = input;
        setValue("keyBinding", getShortcutCode(input));
    };

    return (
        <div className="preset-modifier__popup">
            <div className="preset-modifier__popup-inner" style={coloredShadow}>
                <div className="header">
                    {preset.id
                        ? <span>Edit <span className="preset-name">{preset.displayName}</span> Preset</span>
                        : <span>Create New Preset</span>
                    }
                    <FontAwesomeIcon className="button close-button" icon={["fas", "window-close"]} size="lg" onClick={onClose} title="Close Without Saving" />
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
                            <input type="text" autoComplete="false" defaultValue={preset.keyBindingStr} onKeyPress={handleShortcutKeyPress} onPaste={handleShortcutPaste} onChange={handleShortcutChange} />
                            <Controller
                                name="keyBinding"
                                control={control}
                                onChange={getOnChangeInt}
                                as={<input type="hidden" />}
                                defaultValue={preset.keyBinding || 0}
                            />
                        </div>
                        <div>
                            <div className="subtitle">
                                <span>List of MIDI mappings</span>
                                <div className="button add-button" onClick={() => prepend(newMidiMapping())}>
                                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="2x" title="Add MIDI Mapping" />
                                </div>
                            </div>
                            <div>
                                {
                                    fields.map((mapping, index) => (
                                        <div key={mapping.id} className="midi-mapping preset-modifier__item">
                                            <FontAwesomeIcon className="button delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => remove(index)} title="Remove MIDI Mapping" />
                                            <label className="key-label">Key</label>
                                            <input className="key-input" name={`midiMappings[${index}].key`} type="number" defaultValue={mapping.key} ref={register({ valueAsNumber: true })} />

                                            <label className="channel-label">Channel</label>
                                            <input className="channel-input" name={`midiMappings[${index}].channel`} type="number" defaultValue={mapping.channel} ref={register({ valueAsNumber: true })} />

                                            <label className="behavior-label">Behavior</label>
                                            <select className="behavior-input" name={`midiMappings[${index}].behavior`} defaultValue={mapping.behavior} ref={register()}>
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
                    <div className={`button test-button ${testIsRunning && "disabled"}`} onClick={handleSubmit(onTest)} >
                        <span>Test</span>
                        <FontAwesomeIcon icon={["fas", "vial"]} size="1x" title="Run This Preset For Three Seconds" />
                    </div>
                    <div className="button save-button" onClick={handleSubmit(onSubmit)}>
                        <span>Save</span>
                        <FontAwesomeIcon icon={["fas", "save"]} size="1x" title="Save This Preset" />
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const presetToEdit = selectPresetToEdit(state);
    if (!presetToEdit) {
        return;
    }

    const { effectType, preset } = presetToEdit;
    const testIsRunning = selectTestIsRunning(state);

    return {
        preset,
        effectType,
        testIsRunning
    };
}

const mapDispatchToProps = {
    onClose: closePresetModifier,
    onSubmitForm: upsertPreset,
    onTestPreset: testPreset
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetModifier);
