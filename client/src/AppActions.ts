import { connect } from "@giantmachines/redux-websocket";
import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    fetchAllPresets as doFetchAllPresets,
    fetchPresetsOfType as doFetchPresetsOfType,

    getServers as doGetServers,
    getStages as doGetStages,
    getVersion as doGetVersion,

    selectStage as doSelectStage,
    toggleServer as doToggleServer
} from "./client/HttpClient";
import { Server } from "./domain/client/Server";
import { EffectType } from "./domain/EffectType";
import { PresetCollection } from "./domain/PresetCollection";
import { Preset } from "./domain/presets/Preset";
import { RootState } from "./RootState";
import { setEffectTypes } from "./utils/utils";

// ACTION TYPES
export const DID_INITIALIZE_APP = "app/DID_INITIALIZE_APP";
export const DID_GET_VERSION = "app/DID_GET_VERSION";
export const DID_GET_SERVERS = "app/DID_GET_SERVERS";
export const DID_GET_STAGES = "app/DID_GET_STAGES";
export const DID_GET_ALL_PRESETS = "app/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "app/DID_GET_PRESETS_OF_TYPE";
export const DID_RECEIVE_WEBSOCKET_MESSAGE = "REDUX_WEBSOCKET::MESSAGE";

interface DidInitializeApp {
    type: typeof DID_INITIALIZE_APP,
    payload: string
}
interface DidGetVersion {
    type: typeof DID_GET_VERSION,
    payload: string
}
interface DidGetServers {
    type: typeof DID_GET_SERVERS,
    payload: Server[]
}
interface DidGetStages {
    type: typeof DID_GET_STAGES,
    payload: string[]
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
    type: typeof DID_RECEIVE_WEBSOCKET_MESSAGE,
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
const didGetStages = createAction<string[]>(DID_GET_STAGES);
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

    const servers = await doGetServers();
    dispatch(didGetServers(servers));

    const stages = await doGetStages();
    dispatch(didGetStages(stages));

    const presetCollection = await doFetchAllPresets();
    setEffectTypes(presetCollection);

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
export const selectStage = (stage: string): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    await doSelectStage(stage);

    const presetCollection = await doFetchAllPresets();
    setEffectTypes(presetCollection);

    dispatch(didGetAllPresets(presetCollection));
};
