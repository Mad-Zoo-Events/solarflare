import React, { ChangeEvent, FocusEvent, KeyboardEvent, ReactElement, useState } from "react";
import { connect } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { runCommand } from "../../../../client/HttpClient";
import { setIgnoreKeystrokes } from "../../ControlPanelActions";
import { CommandControlProps } from "./CommandControlProps";

const CommandControl = ({
    setIgnoreKeystrokes
}: CommandControlProps): ReactElement => {
    const [command, setCommand] = useState("");

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setCommand(e.currentTarget.value);
    const handleFocus = () => setIgnoreKeystrokes(true);
    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        const currentTarget = event.currentTarget;
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setIgnoreKeystrokes(false);
            }
        }, 0);
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            const { value } = e.currentTarget;
            await runCommand(value);
            setCommand("");
        }
    };

    return (
        <div onBlur={handleBlur}>
            <TextareaAutosize
                className="code"
                style={{ width: "20em" }}
                minRows={2}
                placeholder="smite Mat_Zo"
                value={command}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                spellCheck={false}
                autoFocus={true}>
            </TextareaAutosize>
        </div>
    );
};

const mapDispatchToProps = {
    setIgnoreKeystrokes: setIgnoreKeystrokes
};

export default connect(null, mapDispatchToProps)(CommandControl);
