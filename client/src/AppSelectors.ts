import { createSelector } from "reselect";
import { selectAppState } from "./rootSelectors";
import { combinePresets, combinePresetsWithoutCommands } from "./utils/utils";

export const selectVersion = createSelector(selectAppState, ({ version }) => version);

export const selectServers = createSelector(selectAppState, ({ servers }) => servers);
export const selectStages = createSelector(selectAppState, ({ stages }) => stages);
export const selectSelectedStage = createSelector(selectAppState, ({ selectedStage }) => selectedStage);

export const selectPresets = createSelector(selectAppState, ({ presets }) => presets);
export const selectCombinedPresets = createSelector(selectAppState, ({ presets }) => combinePresets(presets));
export const selectCombinedPresetsWithoutCommands = createSelector(selectAppState, ({ presets }) => combinePresetsWithoutCommands(presets));
