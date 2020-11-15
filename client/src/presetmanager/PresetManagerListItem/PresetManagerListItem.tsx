import React from "react";
import { PresetManagerListItemProps } from "./PresetManagerListProps";
import "./PresetManagerListItem.scss";

const PresetManagerListItem = ({
    preset
}: PresetManagerListItemProps) => {
    const { id, displayName, description, keyBinding } = preset;
    return (
        <>
            <div>{id}</div>
            <div>{displayName}</div>
            <div>{description}</div>
            <div>{keyBinding}</div>
            <hr />
        </>
    );
};

export default PresetManagerListItem;
