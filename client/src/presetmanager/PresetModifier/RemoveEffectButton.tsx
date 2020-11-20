import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./RemoveEffectButton.scss";

interface RemoveEffectButtonProps {
    fields: any[]
    remove: (index: number) => void
    index: number
}

const RemoveEffectButton = ({
    fields,
    remove,
    index
}: RemoveEffectButtonProps) => {
    const removeEffect = (index: number) => {
        fields.length > 1 ? remove(index) : alert("Gotta keep at least one effect");
    };

    return <FontAwesomeIcon
        className="delete-button"
        icon={["far", "trash-alt"]}
        size="2x"
        onClick={() => removeEffect(index)}
    />;
};

export default RemoveEffectButton;
