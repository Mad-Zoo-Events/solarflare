import { ReactNode, ReactNodeArray } from "react";

export interface PageProps {
    isControlPanel: boolean
    headerElements?: ReactNode | ReactNodeArray
    children: ReactNode | ReactNodeArray
    version: string
}
