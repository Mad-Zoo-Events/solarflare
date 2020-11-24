import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { Control, useFieldArray } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { CommandPreset } from "../../../domain/presets";
import RemoveEffectButton from "../RemoveEffectButton";
import "./CommandFragment.scss";

interface CommandFragmentProps {
    preset: CommandPreset
    control: Control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any
}

const CommandFragment = ({
    preset,
    register,
    control
}:CommandFragmentProps): ReactElement => {
    preset.commands = preset.commands || [{ command: "" }];

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "commands"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">List of commands</div>

            <div className="add-button" onClick={() => prepend({ ...preset.commands[0] })}>
                <FontAwesomeIcon className="add-button" icon={["fas", "plus-circle"]} size="lg" title="Add Another Effect" />
            </div>
            {
                fields.map((effect, index) => (
                    <div key={effect.id} className="preset-modifier__command-item preset-modifier__item">
                        <RemoveEffectButton numOfFields={fields.length} remove={remove} index={index}/>

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
