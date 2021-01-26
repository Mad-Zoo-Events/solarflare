import { createSelector } from "reselect";
import { selectSystemSettingsState } from "../../rootSelectors";

export const selectInstanceStatus = createSelector(selectSystemSettingsState, ({ instanceStatus }) => instanceStatus);
