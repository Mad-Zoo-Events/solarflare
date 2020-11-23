import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { CommandPreset } from "../../../domain/presets";
import RemoveEffectButton from "../RemoveEffectButton";
import "./CommandFragment.scss";
import TextareaAutosize from "react-textarea-autosize";

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
            <div className="preset-modifier__subtitle">List of commands</div>

            <div className="add-button" onClick={() => prepend({ ...preset.commands[0] })}>
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" />
            </div>
            {
                fields.map((effect, index) => (
                    <div key={effect.id} className="preset-modifier__command-item preset-modifier__item">
                        <RemoveEffectButton fields={fields} remove={remove} index={index}/>

                        <label>Command #{index + 1}</label>
                        <div className="command-input">
                            <TextareaAutosize
                                name={`commands[${index}].command`}
                                placeholder="smite Mat_Zo"
                                defaultValue={effect.command}
                                spellCheck={false}
                                ref={register()}>
                            </TextareaAutosize>
                        </div>
                    </div>
                ))
            }
        </>
    );
};

export default CommandFragment;
