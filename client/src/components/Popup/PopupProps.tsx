import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { ReactNode, ReactNodeArray } from "react";

export interface PopupProps {
    label: string
    iconProps?: FontAwesomeIconProps
    children: ReactNode | ReactNodeArray
}
