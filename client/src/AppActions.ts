import { connect } from "@giantmachines/redux-websocket";
import { Layout } from "react-grid-layout";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    fetchAllPresets as doFetchAllPresets,
    fetchPresetsOfType as doFetchPresetsOfType,
    getSetting as doGetSetting,
    getVersion as doGetVersion,
    manageServer as doManageServer,
    setSetting as doSetSetting
} from "./client/HttpClient";
import {
    didChangeLayout,
    didStartEffect,
    didStopAll,
    didStopEffect,
    shouldChangeClockSpeed,
    shouldChooseDisplayCategories,
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
import * as is from "./domain/InstanceStatus";
import { LogEntry, LogLevel } from "./domain/LogEntry";
import { PresetCollection } from "./domain/PresetCollection";
import { Preset } from "./domain/presets/Preset";
import * as sa from "./domain/ServerAction";
import { RootState } from "./RootState";
import { getPreset } from "./utils/utils";

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
        ? "ws://localhost:5000/api/socket"
        : `wss://${window.location.host}/api/socket`;

    dispatch(connect(url));

    const version = await doGetVersion();
    dispatch(didGetVersion(version));

    const presetCollection = await doFetchAllPresets();
    dispatch(didGetAllPresets(presetCollection));

    try {
        const storedLayout = await doGetSetting<Layout[]>("layout");
        dispatch(didChangeLayout(storedLayout));
    } catch (error) {
        console.log("failed to read layout setting: ", error);
    }

    try {
        const storedDisplayCategories = await doGetSetting<EffectType[]>("displayCategories");
        dispatch(shouldChooseDisplayCategories(storedDisplayCategories));
    } catch (error) {
        console.log("failed to read display category setting: ", error);
    }

    dispatch(didInitializeApp());
};
export const fetchPresetsOfType = (effectType: EffectType): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const presets = await doFetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
export const chooseStage = (stage: string): ThunkAction<void, RootState, null, AnyAction> => dispatch => {
    dispatch(stopAll({ stopEffects: true, detachClocks: true }));
    doSetSetting("stage", stage);
};
// Servers
export const enableServer = (id: string): ThunkAction<void, RootState, null, AnyAction> => () => {
    doManageServer(id, sa.EnableServer);
};
export const disableServer = (id: string): ThunkAction<void, RootState, null, AnyAction> => () => {
    doManageServer(id, sa.DisableServer);
};
export const startServer = (id: string): ThunkAction<void, RootState, null, AnyAction> => () => {
    doManageServer(id, sa.StartServer);
};
export const stopServer = (id: string): ThunkAction<void, RootState, null, AnyAction> => () => {
    doManageServer(id, sa.StopServer);
};
export const handleSocketMessage = (message: BackendMessage, presets: PresetCollection, isTyping: boolean): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const getTimer = (id: string) => window.setInterval(() => dispatch(shouldIncrementCounter(id)), 1000);

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
            message:
            (stopAll ? stopAll.specificTypeOnly || "" : displayName) +
            (errorMessage ? ` | ${errorMessage}` : "")
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
                        dispatch(didStartEffect({ effect: { preset, interval: -1, secondsRunning: 0 }, getTimer }));
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
                dispatch(didStartEffect({
                    effect: {
                        preset,
                        interval: -1,
                        secondsRunning: 0,
                        offBeatClock: isOffBeat,
                        onBeatClock: !isOffBeat
                    },
                    getTimer
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
        const { actionPerformed, performedOnId, servers } = serverUpdate;

        dispatch(didGetServers(servers));

        const updatedServer = servers.find(s => s.id === performedOnId);

        let level = LogLevel.Info;
        let message = "";

        if (actionPerformed === sa.EnableServer || actionPerformed === sa.DisableServer) {
            const activeCount = servers.filter(s => s.isActive).length;

            if (activeCount === 0) level = LogLevel.Warn;

            message = updatedServer ? `${updatedServer.name} has been ${actionPerformed}d => ` : "";
            message += `${activeCount === 1 ? "One server is" : `${activeCount === 0 ? "No" : activeCount} servers are`} currently listening`;
        }

        if (actionPerformed === sa.StartServer || actionPerformed === sa.StopServer) {
            if (updatedServer?.instanceStatus === is.Running) level = LogLevel.Success;
            if (updatedServer?.instanceStatus === is.Stopped) level = LogLevel.Warn;
            message = `${updatedServer?.name} is ${updatedServer?.instanceStatus}`;
        }

        dispatch(shouldWriteLog({
            level,
            category: "SERVERS",
            message
        }));
    }

    if (stageUpdate) {
        dispatch(didGetStages(stageUpdate));

        const presetCollection = await doFetchAllPresets();
        dispatch(didGetAllPresets(presetCollection));

        dispatch(shouldWriteLog({
            level: LogLevel.Info,
            category: "STAGE",
            message: `Selected stage: ${stageUpdate.selectedStage.toUpperCase()}`
        }));
    }
};
