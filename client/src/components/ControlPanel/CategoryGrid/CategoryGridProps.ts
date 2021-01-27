import { Layout } from "react-grid-layout";
import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../../domain/EffectType";
import { PresetCollection } from "../../../domain/PresetCollection";
import { changeLayout } from "../ControlPanelActions";

export interface CategoryGridProps {
    presets: PresetCollection
    displayCategories: EffectType[]
    layout: Layout[]

    changeLayout: HandleThunkActionCreator<typeof changeLayout>
}
