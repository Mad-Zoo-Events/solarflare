import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, ReactElement } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { connect } from "react-redux";
import * as et from "../../domain/EffectType";
import { CommandPreset, DragonPreset, LaserPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "../../domain/presets";
import { MidiBehaviorTypes } from "../../domain/presets/IPreset";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";
import { getShortcutCode, getShortcutString } from "../../utils/utils";
import { closePresetModifier } from "../PresetManagerActions";
import { CommandFragment, DragonFragment, LaserFragment, ParticleFragment, PotionFragment, TimeshiftFragment } from "./fragments";
import "./PresetModifier.scss";
import { PresetModifierProps } from "./PresetModifierProps";

const PresetModifier = ({
    preset,
    effectType,
    onClose
}: PresetModifierProps): ReactElement => {
    preset = preset || { id: "", displayName: "" };
    preset.keyBindingStr = getShortcutString(preset.keyBinding);

    const newMidiMapping = () => ({ channel: 1, key: 1, behavior: "trigger" });

    const { register, handleSubmit, control, setValue, watch } = useForm<Preset>({
        defaultValues: preset
    });

    const onSubmit = (formValues: Preset) => {
        console.log(formValues);
    };

    const specificInputs = () => {
        switch (effectType) {
        case et.Command:
            return <CommandFragment preset={preset as CommandPreset} register={register} control={control} />;
        case et.Dragon:
            return <DragonFragment preset={preset as DragonPreset} register={register} control={control} />;
        case et.Laser:
            return <LaserFragment preset={preset as LaserPreset} register={register} control={control} watch={watch} />;
        case et.Particle:
            return <ParticleFragment preset={preset as ParticlePreset} register={register} control={control} watch={watch} setValue={setValue} />;
        case et.Potion:
            return <PotionFragment preset={preset as PotionPreset} register={register} control={control} />;
        case et.Timeshift:
            return <TimeshiftFragment preset={preset as TimeshiftPreset} register={register} control={control} setValue={setValue} />;
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

    return (
        <div className="preset-modifier__popup">
            <div className="preset-modifier__popup-inner">
                <div className="preset-modifier__header">
                    {preset.id ? <> Edit <span className="preset-name">{preset.displayName}</span> </> : "Create New Preset"}

                    <div className="form-buttons">
                        <FontAwesomeIcon className="save-button" icon={["fas", "save"]} size="2x" onClick={handleSubmit(onSubmit)} />
                        <FontAwesomeIcon className="close-button" icon={["fas", "window-close"]} size="2x" onClick={onClose} />
                    </div>
                </div>

                <div className="preset-modifier__content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="preset-modifier__common-inputs">
                            <label>Display Name</label>
                            <input name="displayName" type="text" autoComplete="false" placeholder="Preset display name" ref={register} />

                            <label>Description</label>
                            <input name="description" type="text" autoComplete="false" placeholder="Short description" ref={register} />

                            <label>Keyboard Shortcut</label>
                            <input type="text" autoComplete="false" defaultValue={preset.keyBindingStr} onKeyPress={handleShortcutKeyPress} onPaste={handleShortcutPaste} />
                            <input name="keyBinding" type="hidden" ref={register} />
                        </div>
                        <div>
                            <div className="preset-modifier__subtitle">List of MIDI mappings</div>
                            <div>
                                <div className="add-button" onClick={() => prepend(newMidiMapping())}>
                                    <FontAwesomeIcon icon={["fas", "plus-circle"]} size="lg" />
                                </div>
                                {
                                    fields.map((mapping, index) => (
                                        <div key={mapping.id} className="preset-modifier__midi-mapping">
                                            <FontAwesomeIcon className="delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => remove(index)} />
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
    onClose: closePresetModifier
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetModifier);
