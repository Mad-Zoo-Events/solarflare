import React, { Fragment } from "react";
import { CommandPreset } from "../../domain/presets";

interface CommandFragmentProps {
    preset: CommandPreset
    register: any
}

const CommandFragment = ({
    preset,
    register
}:CommandFragmentProps) => {
    preset.commands = preset.commands || [""];

    return (
        <>
            {preset.commands.map((command, index) => (
                <Fragment key={index}>
                    <label>Command
                        <textarea name={`commands[${index}]`} cols={50} rows={5} placeholder="smite Mat_Zo" ref={register}></textarea>
                    </label>
                </Fragment>
            ))}
        </>
    );
};

export default CommandFragment;
