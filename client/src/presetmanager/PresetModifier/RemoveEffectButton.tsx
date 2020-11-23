import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement } from "react";
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
        numOfFields > 1 ? remove(index) : alert("Gotta keep at least one effect");
    };

    return <FontAwesomeIcon
        className="delete-button"
        icon={["far", "trash-alt"]}
        size="2x"
        onClick={() => removeEffect(index)}
    />;
};

export default RemoveEffectButton;
