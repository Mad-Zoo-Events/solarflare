import { HandleThunkActionCreator } from "react-redux";
import { selectDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    displayMode: string

    selectDisplayMode: HandleThunkActionCreator<typeof selectDisplayMode>
}
