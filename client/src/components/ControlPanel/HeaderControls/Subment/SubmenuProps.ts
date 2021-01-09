import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export interface SubmenuProps {
    label: string
    iconProps?: FontAwesomeIconProps
    multiselect?: boolean

    options: Option[]
    onChange: (changed: Option, allSelected?: Option[]) => void
}

export interface Option {
    value: string
    text: string
    selected: boolean
}
