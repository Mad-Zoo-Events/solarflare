import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement, useState } from "react";
import { PopupProps } from "./PopupProps";

const Popup = ({
    label,
    iconProps,
    children
}: PopupProps): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="button popup-label" onClick={() => setIsOpen(!isOpen)}>
                {iconProps && <div><FontAwesomeIcon {...iconProps}/></div>}
                <div>{label}</div>
            </div>
            <div className="popup-holder">
                <div className={`popup-content${isOpen ? " show-popup" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;
