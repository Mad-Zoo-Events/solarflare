export interface SelectProps {
    multiselect?: boolean
    options: Option[]
    onChange: (changed: Option, allSelected?: Option[]) => void
}

export interface Option {
    value: string
    text: string
    selected: boolean
}
