import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { CommandPreset } from "../../domain/presets";

interface CommandFragmentProps {
    preset: CommandPreset
    register: any
    control: any
}

const CommandFragment = ({
    preset,
    register,
    control
}:CommandFragmentProps) => {
    preset.commands = preset.commands || [{ command: "" }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "commands"
    });

    return (
        <>
            <FontAwesomeIcon icon={["fas", "plus-circle"]} size="lg" onClick={() => prepend({ ...preset.commands[0] })} />
            {fields.map((effect, index) => (
                <div key={effect.id}>
                    <FontAwesomeIcon icon={["far", "trash-alt"]} size="2x" onClick={() => remove(index)} />
                    <label>Command</label>
                    <textarea name={`commands[${index}].command`} cols={50} rows={5} placeholder="smite Mat_Zo" ref={register()}></textarea>
                </div>
            ))}
        </>
    );
};

export default CommandFragment;
