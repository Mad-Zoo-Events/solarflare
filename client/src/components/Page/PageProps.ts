import { ReactNode, ReactNodeArray } from "react";

export interface PageProps {
    isControlPanel: boolean
    headerElements?: ReactNode | ReactNodeArray
    children: ReactNode | ReactNodeArray
    footerElements?: ReactNode | ReactNodeArray
    isInitialized: boolean
    version: string
}
