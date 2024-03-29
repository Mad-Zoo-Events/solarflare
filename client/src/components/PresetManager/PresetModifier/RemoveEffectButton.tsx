import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
import { toast } from "react-toastify";
import "./RemoveEffectButton.scss";

interface RemoveEffectButtonProps {
    numOfFields: number
    remove: (index: number) => void
    index: number
}

const RemoveEffectButton = ({
    numOfFields,
    remove,
    index
}: RemoveEffectButtonProps): ReactElement => {
    const removeEffect = (index: number) => {
        numOfFields > 1
            ? remove(index)
            : toast.error("Gotta keep at least one effect");
    };

    return <FontAwesomeIcon
        className="delete-button"
        icon={["far", "trash-alt"]}
        size="2x"
        onClick={() => removeEffect(index)}
        title="Remove This Effect"
    />;
};

export default RemoveEffectButton;
