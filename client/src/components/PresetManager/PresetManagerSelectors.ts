import { createSelector } from "reselect";
import { selectPresetManagerState } from "../../rootSelectors";

export const selectPresetToEdit = createSelector(selectPresetManagerState, ({ presetToEdit }) => presetToEdit);
export const selectToast = createSelector(selectPresetManagerState, ({ toast }) => toast);
export const selectTestIsRunning = createSelector(selectPresetManagerState, ({ testIsRunning }) => testIsRunning);
