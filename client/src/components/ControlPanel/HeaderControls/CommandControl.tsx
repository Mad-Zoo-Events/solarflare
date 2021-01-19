import React, { ChangeEvent, KeyboardEvent, ReactElement, useState } from "react";
import { runComand } from "../../../client/HttpClient";
import TextareaAutosize from "react-textarea-autosize";

const CommandControl = (): ReactElement => {
    const [command, setCommand] = useState("");

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setCommand(e.currentTarget.value);

    const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            const { value } = e.currentTarget;
            await runComand(value);
            setCommand("");
        }
    };

    return (
        <div>
            <TextareaAutosize
                className="code"
                style={{ width: "20em" }}
                minRows={2}
                placeholder="smite Mat_Zo"
                value={command}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                spellCheck={false}
                autoFocus={true}>
            </TextareaAutosize>
        </div>
    );
};

export default CommandControl;
