import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import * as et from "../../domain/EffectType";
import { CommandPreset, PotionPreset, TimeshiftPreset } from "../../domain/presets";
import { Preset } from "../../domain/presets/Preset";
import { RootState } from "../../RootState";
import { closePresetModifier } from "../PresetManagerActions";
import CommandFragment from "./CommandFragment";
import PotionFragment from "./PotionFragment";
import "./PresetModifier.scss";
import { PresetModifierProps } from "./PresetModifierProps";
import TimeshiftFragment from "./TimeshiftFragment";

const PresetModifier = ({
    preset,
    effectType,
    onClose
}: PresetModifierProps) => {
    preset = preset || { id: "", displayName: "" };

    const { register, handleSubmit, control, setValue } = useForm<Preset>({
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
            break;
        case et.Laser:
            break;
        case et.Particle:
            break;
        case et.Potion:
            return <PotionFragment preset={preset as PotionPreset} register={register} control={control} />;
        case et.Timeshift:
            return <TimeshiftFragment preset={preset as TimeshiftPreset} register={register} control={control} setValue={setValue} />;
        }
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
                            <input name="displayName" type="text" autoComplete="false" placeholder="Preset display name" ref={register()} />
                            <br />

                            <label>Description</label>
                            <input name="description" type="text" autoComplete="false" placeholder="Short description" ref={register()} />
                            <br />

                            <label>Keyboard Shortcut</label>
                            <input name="keyBinding" type="text" autoComplete="false" ref={register()} />
                            <br />
                        </div>

                        {specificInputs()}
                    </form>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const { effectType, preset } = state.presetmanager.presetToEdit!;

    return {
        preset,
        effectType
    };
}

const mapDispatchToProps = {
    onClose: closePresetModifier
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetModifier);
