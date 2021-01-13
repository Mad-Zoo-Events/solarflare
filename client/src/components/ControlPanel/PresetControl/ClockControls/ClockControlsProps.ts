import { HandleThunkActionCreator } from "react-redux";
import { ClockSubscriptionOptions } from "../../../../domain/client/ClockSubscriptionOptions";
import { handleClockSubscription } from "../../ControlPanelActions";

export interface ClockControlsProps {
    onBeatAttached?: boolean
    offBeatAttached?: boolean
    clockOnBeat: boolean
    subscriptionOptions: ClockSubscriptionOptions

    handleClockSubscription: HandleThunkActionCreator<typeof handleClockSubscription>
}
