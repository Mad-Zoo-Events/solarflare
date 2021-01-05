import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../../RootState";

// ACTION TYPES
export const SHOULD_CHANGE_DISPLAY_MODE = "controlpanel/SHOULD_CHANGE_DISPLAY_MODE";

export interface ChangeDisplayMode {
    type: typeof SHOULD_CHANGE_DISPLAY_MODE
    payload: boolean
}

export type ControlPanelAction = ChangeDisplayMode

// ACTION CREATORS
export const changeDisplayMode = createAction(SHOULD_CHANGE_DISPLAY_MODE);

// ACTIONS
export const selectDisplayMode = (categorized: boolean): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(changeDisplayMode(categorized));
};
