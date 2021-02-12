import { IPreset } from "./IPreset";

export interface LightningPreset extends IPreset {
    pointIDList: string
}

export const getLightningSummary = ({ pointIDList }: LightningPreset): string => {
    return `${pointIDList.split(",").length} lightnings: at ${pointIDList}`;
};
