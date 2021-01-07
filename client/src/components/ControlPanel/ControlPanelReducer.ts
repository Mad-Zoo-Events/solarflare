import { RunningEffect } from "../../domain/RunningEffect";
import { ControlPanelAction, DID_START_EFFECT, DID_STOP_EFFECT, INCREMENT_COUNTER, SHOULD_CHANGE_DISPLAY_MODE } from "./ControlPanelActions";
import { ControlPanelState } from "./ControlPanelState";

const initialState: ControlPanelState = {
    categorize: true,
    runningEffects: new Map()
};

const addRunning = (id: string, { runningEffects }: ControlPanelState): Map<string, RunningEffect> => {
    const effects = new Map(runningEffects);
    effects.set(id, { secondsRunning: 0 });
    return effects;
};

const removeRunning = (id: string, { runningEffects }: ControlPanelState): Map<string, RunningEffect> => {
    const effects = new Map(runningEffects);
    effects.delete(id);
    return effects;
};

const increaseCounter = (id: string, { runningEffects }: ControlPanelState): Map<string, RunningEffect> => {
    const effects = new Map(runningEffects);
    const effect = effects.get(id);
    if (effect) {
        effect.secondsRunning++;
    }
    return effects;
};

function controlPanelReducer (
    // eslint-disable-next-line default-param-last
    state: ControlPanelState = initialState,
    action: ControlPanelAction
): ControlPanelState {
    switch (action.type) {
    case SHOULD_CHANGE_DISPLAY_MODE:
        return {
            ...state,
            categorize: action.payload
        };
    case DID_START_EFFECT:
        return {
            ...state,
            runningEffects: addRunning(action.payload, state)
        };
    case DID_STOP_EFFECT:
        return {
            ...state,
            runningEffects: removeRunning(action.payload, state)
        };
    case INCREMENT_COUNTER:
        return {
            ...state,
            runningEffects: increaseCounter(action.payload, state)
        };
    default:
        return state;
    }
}

export default controlPanelReducer;
