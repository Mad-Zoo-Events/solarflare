import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { useFieldArray } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { CommandPreset } from "../../../domain/presets";
import RemoveEffectButton from "../RemoveEffectButton";
import "./CommandFragment.scss";
import { PresetModifierFragmentProps } from "./PresetModifierFragmentProps";

const CommandFragment = ({
    preset,
    formMethods
}: PresetModifierFragmentProps): ReactElement => {
    const commandPreset = preset as CommandPreset;
    commandPreset.commands = commandPreset.commands || [{ command: "" }];

    const { control, register } = formMethods;

    const { fields, prepend, remove } = useFieldArray({
        control,
        name: "commands"
    });

    return (
        <>
            <div className="preset-modifier__subtitle">List of commands</div>

            <div className="add-button" onClick={() => prepend({ ...commandPreset.commands[0] })}>
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
