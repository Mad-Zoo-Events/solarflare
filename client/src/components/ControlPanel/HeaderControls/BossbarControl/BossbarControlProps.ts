import { HandleThunkActionCreator } from "react-redux";
import BossbarColor from "../../../../domain/controlpanel/BossbarColor";
import { clearBossbar, setIgnoreKeystrokes, updateBossbar } from "../../ControlPanelActions";

export interface BossbarControlProps {
    title: string
    color: BossbarColor

    setIgnoreKeystrokes: HandleThunkActionCreator<typeof setIgnoreKeystrokes>
    updateBossbar: HandleThunkActionCreator<typeof updateBossbar>
    clearBossbar: HandleThunkActionCreator<typeof clearBossbar>
}
