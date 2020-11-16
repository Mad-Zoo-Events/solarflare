import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import * as et from "../../domain/EffectType";
import { CommandPreset, TimeshiftPreset } from "../../domain/presets";
import { Preset } from "../../domain/presets/Preset";
import { shouldClosePresetModifier } from "../PresetManagerActions";
import CommandFragment from "./CommandFragment";
import "./PresetModifier.scss";
import { PresetModifierProps } from "./PresetModifierProps";
import TimeshiftFragment from "./TimeshiftFragment";

const PresetModifier = ({
    preset,
    effectType,
    onClose
}: PresetModifierProps) => {
    preset = preset || { id: "", displayName: "" };

    const { register, handleSubmit } = useForm<Preset>({
        defaultValues: preset
    });
    const onSubmit = useCallback((formValues: Preset) => {
        console.log(formValues);
    }, []);

    const specificInputs = () => {
        switch (effectType) {
        case et.Command:
            return <CommandFragment preset={preset as CommandPreset} register={register} />;
        case et.Dragon:
            break;
        case et.Laser:
            break;
        case et.Particle:
            break;
        case et.Potion:
            break;
        case et.Timeshift:
            return <TimeshiftFragment preset={preset as TimeshiftPreset} register={register} />;
        }
    };

    return (
        <div className="preset-modifier__popup">
            <div className="preset-modifier__popup-inner">
                <div className="preset-modifier__header">
                    {preset.id ? `Edit "${preset.displayName}"` : "Create New Preset"}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Display Name
                        <input name="displayName" type="text" placeholder="Preset display name" ref={register} />
                    </label>
                    <br />

                    <label>Description
                        <input name="description" type="text" placeholder="Short description" ref={register} />
                    </label>
                    <br />

                    <label>Keyboard Shortcut
                        <input name="keyBinding" type="text" ref={register} />
                    </label>
                    <br />

                    {specificInputs()}

                    <input type="submit" value="Save" />
                </form>
                <br />

                <button onClick={onClose}>close</button>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    onClose: shouldClosePresetModifier
};

export default connect(null, mapDispatchToProps)(PresetModifier);
