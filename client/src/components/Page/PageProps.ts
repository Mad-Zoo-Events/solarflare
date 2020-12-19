import { ReactNode, ReactNodeArray } from "react";

export interface PageProps {
    isControlPanel: boolean
    children: ReactNode | ReactNodeArray
    version: string
}
