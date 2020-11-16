import React, { Fragment, useCallback } from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { CommandPreset } from "../../domain/presets";
import { shouldClosePresetModifier } from "../PresetManagerActions";
import { CommandPresetModifierProps } from "./CommandPresetModifierProps";
import "./PresetModifier.scss";

const CommandPresetModifier = ({
    preset,
    onClose
}: CommandPresetModifierProps) => {
    const { register, handleSubmit } = useForm<CommandPreset>({
        defaultValues: preset
    });
    const onSubmit = useCallback((formValues: CommandPreset) => {
        console.log(formValues);
    }, []);

    return (
        <div className="preset-modifier__popup">
            <div className="preset-modifier__popup-inner">
                <div className="preset-modifier__header">
                    {preset.id ? `Edit ${preset.displayName}` : "Create New"} Command Preset
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
                    {preset.commands.map((command, index) => (
                        <Fragment key={index}>
                            <label>Command
                                <textarea name={`commands[${index}]`} cols={50} rows={5} placeholder="smite Mat_Zo" ref={register}></textarea>
                            </label>
                        </Fragment>
                    ))}

                    <br />

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

export default connect(null, mapDispatchToProps)(CommandPresetModifier);
