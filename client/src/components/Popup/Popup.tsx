import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FocusEvent, ReactElement, useState } from "react";
import { PopupProps } from "./PopupProps";

const Popup = ({
    label,
    iconProps,
    children
}: PopupProps): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => { setIsOpen(!isOpen); };
    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
        const currentTarget = event.currentTarget;
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setIsOpen(false);
            }
        }, 0);
    };

    return (
        <div onBlur={handleBlur}>
            <div
                className="button popup-label"
                tabIndex={1}
                onClick={handleClick}
            >
                {iconProps && <div><FontAwesomeIcon {...iconProps}/></div>}
                <div>{label}</div>
            </div>
            <div
                className="popup-holder"
                tabIndex={1}
            >
                {isOpen && <div className="popup-content">
                    {children}
                </div>}
            </div>
        </div>
    );
};

export default Popup;
