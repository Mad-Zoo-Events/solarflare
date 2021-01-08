import { HandleThunkActionCreator } from "react-redux";
import { stopAll } from "../ControlPanelActions";

export interface FooterControlsProps {
    stopAll: HandleThunkActionCreator<typeof stopAll>
}
