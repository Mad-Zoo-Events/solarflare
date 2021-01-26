import { ReactNode, ReactNodeArray } from "react";

export interface PageProps {
    title?: string
    renderBackButton?: boolean
    headerElements?: ReactNode | ReactNodeArray
    children: ReactNode | ReactNodeArray
    footerElements?: ReactNode | ReactNodeArray
    isInitialized: boolean
    version: string
}
