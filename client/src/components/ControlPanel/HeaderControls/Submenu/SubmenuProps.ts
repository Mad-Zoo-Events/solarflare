import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export interface SubmenuProps {
    label: string
    iconProps?: FontAwesomeIconProps
    multiselect?: boolean

    options: Option[]
    onChange: (selected: string[]) => void
}

export interface Option {
    value: string
    text: string
    selected?: boolean
}
