import { HandleThunkActionCreator } from "react-redux";
import BossbarColor from "../../../../domain/controlpanel/BossbarColor";
import { setIgnoreKeystrokes, updateBossbar } from "../../ControlPanelActions";

export interface BossbarControlProps {
    text: string
    color: BossbarColor

    setIgnoreKeystrokes: HandleThunkActionCreator<typeof setIgnoreKeystrokes>
    updateBossbar: HandleThunkActionCreator<typeof updateBossbar>
}
