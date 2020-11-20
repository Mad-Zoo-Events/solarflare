import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { CommandPreset } from "../../domain/presets";
import "./CommandFragment.scss";

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

    const removeEffect = (index: number) => {
        fields.length > 1 ? remove(index) : alert("Gotta keep at least one effect");
    };

    return (
        <>
            <div className="preset-modifier__subtitle">List of commands</div>
            <div className="add-button" onClick={() => prepend({ ...preset.commands[0] })}>
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => (
                    <div key={effect.id} className="preset-modifier__command-item">
                        <FontAwesomeIcon className="delete-button" icon={["far", "trash-alt"]} size="2x" onClick={() => removeEffect(index)} />
                        <label>Command #{index + 1}</label>
                        <textarea
                            name={`commands[${index}].command`}
                            placeholder="smite Mat_Zo"
                            defaultValue={effect.command}
                            ref={register()}>
                        </textarea>
                    </div>
                ))
            }
        </>
    );
};

export default CommandFragment;
