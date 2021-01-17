import { connect } from "@giantmachines/redux-websocket";
import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    fetchAllPresets as doFetchAllPresets,
    fetchPresetsOfType as doFetchPresetsOfType,

    getVersion as doGetVersion,

    selectStage as doSelectStage,
    toggleServer as doToggleServer
} from "./client/HttpClient";
import {
    didStartEffect,
    didStopAll,
    didStopEffect,
    shouldChangeClockSpeed,
    shouldClearLogs,
    shouldIncrementCounter,
    shouldUpdateBossbar,
    shouldWriteLog,
    stopAll
} from "./components/ControlPanel/ControlPanelActions";
import { ClearBossbar } from "./domain/BossbarAction";
import { BackendMessage } from "./domain/client/BackendMessage";
import { Server } from "./domain/client/Server";
import { Subscribe } from "./domain/ClockAction";
import * as ea from "./domain/EffectAction";
import { EffectType } from "./domain/EffectType";
import { LogEntry, LogLevel } from "./domain/LogEntry";
import { PresetCollection } from "./domain/PresetCollection";
import { Preset } from "./domain/presets/Preset";
import { RootState } from "./RootState";
import { decoratePresets, getPreset } from "./utils/utils";

// ACTION TYPES
export const DID_INITIALIZE_APP = "app/DID_INITIALIZE_APP";
export const DID_GET_VERSION = "app/DID_GET_VERSION";
export const DID_GET_SERVERS = "app/DID_GET_SERVERS";
export const DID_GET_STAGES = "app/DID_GET_STAGES";
export const DID_GET_ALL_PRESETS = "app/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "app/DID_GET_PRESETS_OF_TYPE";
export const DID_RECEIVE_WEBSOCKET_MESSAGE = "REDUX_WEBSOCKET::MESSAGE";

interface DidInitializeApp {
    type: typeof DID_INITIALIZE_APP
}
interface DidGetVersion {
    type: typeof DID_GET_VERSION
    payload: string
}
interface DidGetServers {
    type: typeof DID_GET_SERVERS
    payload: Server[]
}
interface DidGetStages {
    type: typeof DID_GET_STAGES
    payload: {stages: string[], selectedStage: string}
}
interface DidGetAllPresets {
    type: typeof DID_GET_ALL_PRESETS
    payload: PresetCollection
}
interface DidGetPresetsOfType {
    type: typeof DID_GET_PRESETS_OF_TYPE
    payload: { effectType: EffectType, presets: Preset[] }
}
interface DidReceiveWebsocketMessage {
    type: typeof DID_RECEIVE_WEBSOCKET_MESSAGE
    payload: {
        message: string,
        origin: string,
    },
}

export type AppAction =
    DidInitializeApp |
    DidGetVersion | DidGetServers | DidGetStages |
    DidGetAllPresets | DidGetPresetsOfType |
    DidReceiveWebsocketMessage;

// ACTION CREATORS
const didInitializeApp = createAction(DID_INITIALIZE_APP);
const didGetVersion = createAction<string>(DID_GET_VERSION);
const didGetServers = createAction<Server[]>(DID_GET_SERVERS);
const didGetStages = createAction<{stages: string[], selectedStage: string}>(DID_GET_STAGES);
const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
const didGetPresetsOfType = createAction<{ effectType: EffectType, presets: Preset[] }>(DID_GET_PRESETS_OF_TYPE);

// ACTIONS
export const initializeApp = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const url = location.hostname === "localhost"
        ? "ws://localhost:5000/socket"
        : `wss://${window.location.host}/socket`;

    dispatch(connect(url));

    const version = await doGetVersion();
    dispatch(didGetVersion(version));

    const presetCollection = await doFetchAllPresets();
    decoratePresets(presetCollection);

    dispatch(didGetAllPresets(presetCollection));

    dispatch(didInitializeApp());
};
export const fetchPresetsOfType = (effectType: EffectType): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const presets = await doFetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
export const toggleServer = (server: Server): ThunkAction<void, RootState, null, AnyAction> => () => {
    doToggleServer(server);
};
export const chooseStage = (stage: string): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(stopAll({ stopEffects: true, detachClocks: true }));
    doSelectStage(stage);
};
export const handleSocketMessage = (message: BackendMessage, presets: PresetCollection, isTyping: boolean): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const {
        effectUpdate,
        clockUpdate,
        clockSpeedUpdate,
        bossbarUpdate,
        serverUpdate,
        stageUpdate
    } = message;

    if (effectUpdate) {
        const { id, effectType, displayName, action, errorMessage, stopAll } = effectUpdate;
        const log: LogEntry = {
            level: errorMessage ? LogLevel.Error : LogLevel.Success,
            category: stopAll ? "STOP_ALL" : action,
            message: (stopAll
                ? stopAll.specificTypeOnly || ""
                : displayName) +
                (errorMessage
                    ? ` | ${errorMessage}`
                    : "")
        };

        if (!errorMessage) {
            if (stopAll) {
                dispatch(didStopAll({ ...stopAll }));
                dispatch(shouldClearLogs());
            } else {
                if (action === ea.Stop || action === ea.Restart) {
                    dispatch(didStopEffect(id));
                }
                if (action === ea.Start || action === ea.Restart) {
                    const preset = getPreset(id, effectType, presets);
                    if (preset) {
                        const interval = window.setInterval(() => dispatch(shouldIncrementCounter(id)), 1000);
                        dispatch(didStartEffect({ preset, interval, secondsRunning: 0 }));
                    }
                }
            }
        }

        dispatch(shouldWriteLog(log));
    }

    if (clockUpdate) {
        const { id, effectType, action, isOffBeat } = clockUpdate;
        if (action === Subscribe) {
            const preset = getPreset(id, effectType, presets);
            if (preset) {
                const interval = window.setInterval(() => dispatch(shouldIncrementCounter(id)), 1000);
                dispatch(didStartEffect({
                    preset,
                    interval,
                    secondsRunning: 0,
                    offBeatClock: isOffBeat,
                    onBeatClock: !isOffBeat
                }));
            }
        } else {
            dispatch(didStopEffect(id));
        }
    }

    if (clockSpeedUpdate) {
        dispatch(shouldChangeClockSpeed(clockSpeedUpdate));
    }

    if (bossbarUpdate) {
        const { color, text: title, action } = bossbarUpdate;
        const update = action === ClearBossbar ? null : { color, title };
        if (!isTyping) dispatch(shouldUpdateBossbar(update));
    }

    if (serverUpdate) {
        const { servers } = serverUpdate;
        dispatch(didGetServers(servers));

        const serverCount = servers.filter(s => s.isActive).length;

        dispatch(shouldWriteLog({
            level: LogLevel.Info,
            category: "SERVERS",
            message: `${serverCount === 1 ? "One server is" : `${serverCount} servers are`} now listening`
        }));
    }

    if (stageUpdate) {
        dispatch(didGetStages(stageUpdate));

        const presetCollection = await doFetchAllPresets();
        decoratePresets(presetCollection);
        dispatch(didGetAllPresets(presetCollection));

        dispatch(shouldWriteLog({
            level: LogLevel.Info,
            category: "STAGE",
            message: `Switched to ${stageUpdate.selectedStage} stage`
        }));
    }
};
