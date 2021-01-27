import React from "react";
import ReactGridLayout, { ItemCallback, Layout, WidthProvider } from "react-grid-layout";
import { connect } from "react-redux";
import { selectPresets } from "../../../AppSelectors";
import { RootState } from "../../../RootState";
import { getPresetsOfType } from "../../../utils/utils";
import CategorySection from ".././CategorySection/CategorySection";
import { changeLayout } from ".././ControlPanelActions";
import { selectDisplayCategories, selectLayout } from ".././ControlPanelSelectors";
import { CategoryGridProps } from "./CategoryGridProps";

const GridLayout = WidthProvider(ReactGridLayout);

const CategoryGrid = ({
    presets,
    displayCategories,
    layout,
    changeLayout
}: CategoryGridProps) => {
    const handleLayoutChange: ItemCallback = (layout: Layout[]) => {
        changeLayout(layout);
    };

    if (displayCategories.length === 0) return null;

    return (<GridLayout
        className="layout"
        layout={layout}
        cols={8}
        rowHeight={90}
        margin={[0, 0]}
        autoSize
        isBounded
        compactType="vertical"
        onResizeStop={handleLayoutChange}
        onDragStop={handleLayoutChange}
    >
        {displayCategories.map(effectType => (
            <div key={`cat-${effectType}`}>
                <CategorySection key={`cat-${effectType}`} effectType={effectType} presets={getPresetsOfType(effectType, presets)}/>
            </div>
        ))}
    </GridLayout >);
};

function mapStateToProps (state: RootState) {
    const presets = selectPresets(state);
    const displayCategories = selectDisplayCategories(state);
    const layout = selectLayout(state);

    return {
        presets,
        displayCategories,
        layout
    };
}

const mapDispatchToProps = {
    changeLayout: changeLayout
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryGrid);
