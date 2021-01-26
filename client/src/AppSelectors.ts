import { createSelector } from "reselect";
import { EffectType, allEffectTypes } from "./domain/EffectType";
import { Preset } from "./domain/presets/Preset";
import { selectAppState } from "./rootSelectors";
import { RootState } from "./RootState";
import { combinePresets } from "./utils/utils";

export const selectVersion = createSelector(selectAppState, ({ version }) => version);
export const selectIsInitialized = createSelector(selectAppState, ({ isInitialized }) => isInitialized);
export const selectMessageQueue = createSelector(selectAppState, ({ messageQueue }) => messageQueue);

export const selectServers = createSelector(selectAppState, ({ servers }) => servers);
export const selectStages = createSelector(selectAppState, ({ stages }) => stages);
export const selectSelectedStage = createSelector(selectAppState, ({ selectedStage }) => selectedStage);

export const selectPresets = createSelector(selectAppState, ({ presets }) => presets);

export function selectCombinedPresets (state: RootState, excludedEffectTypes: EffectType[]): Preset[] {
    const effectTypes = allEffectTypes.filter(et => !excludedEffectTypes.includes(et));
    return combinePresets(selectPresets(state), effectTypes);
}
