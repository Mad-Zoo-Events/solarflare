import { HandleThunkActionCreator } from "react-redux";
import { setIgnoreKeystrokes } from "../../ControlPanelActions";

export interface CommandControlProps {
    setIgnoreKeystrokes: HandleThunkActionCreator<typeof setIgnoreKeystrokes>
}
