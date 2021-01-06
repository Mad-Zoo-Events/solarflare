import { HandleThunkActionCreator } from "react-redux";
import { selectDisplayMode } from "../ControlPanelActions";

export interface HeaderControlsProps {
    isCategorizedView: boolean

    toggleCategorizedView: HandleThunkActionCreator<typeof selectDisplayMode>
}
