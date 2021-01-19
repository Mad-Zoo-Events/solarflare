import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactElement, useState } from "react";
import { PopupProps } from "./PopupProps";

const Popup = ({
    label,
    iconProps,
    children
}: PopupProps): ReactElement => {
    const [isOpen, setIsOpen] = useState(false);
    const [mouseOver, setMouseOver] = useState(false);

    const handleMouseOver = () => setMouseOver(true);
    const handleMouseOut = () => setMouseOver(false);
    const handleBlur = () => { if (!mouseOver) setIsOpen(false); };

    return (
        <div>
            <div
                className="button popup-label"
                tabIndex={1}
                onClick={() => setIsOpen(!isOpen)}
                onBlur={handleBlur}
            >
                {iconProps && <div><FontAwesomeIcon {...iconProps}/></div>}
                <div>{label}</div>
            </div>
            <div
                className="popup-holder"
                tabIndex={1}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onBlur={handleBlur}
            >
                <div className={`popup-content ${isOpen ? "show-popup" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Popup;
