import "react-toastify/dist/ReactToastify.css";
import { AnyAction } from "redux";
import { createAction } from "redux-actions";
import { ThunkAction } from "redux-thunk";
import {
    fetchAllPresets as doFetchAllPresets,
    fetchPresetsOfType as doFetchPresetsOfType,

    getServers as doGetServers, getVersion as doGetVersion
} from "./client/Client";
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
export const DID_GET_ALL_PRESETS = "presetmanager/DID_GET_ALL_PRESETS";
export const DID_GET_PRESETS_OF_TYPE = "presetmanager/DID_GET_PRESETS_OF_TYPE";

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
interface DidGetAllPresets {
    type: typeof DID_GET_ALL_PRESETS
    payload: PresetCollection
}
interface DidGetPresetsOfType {
    type: typeof DID_GET_PRESETS_OF_TYPE
    payload: { effectType: EffectType, presets: Preset[] }
}

export type AppAction =
    DidInitializeApp | DidGetVersion | DidGetServers |
    DidGetAllPresets | DidGetPresetsOfType;

// ACTION CREATORS
const didInitializeApp = createAction(DID_INITIALIZE_APP);
const didGetVersion = createAction<string>(DID_GET_VERSION);
const didGetServers = createAction<Server[]>(DID_GET_SERVERS);
const didGetAllPresets = createAction<PresetCollection>(DID_GET_ALL_PRESETS);
const didGetPresetsOfType = createAction<{ effectType: EffectType, presets: Preset[] }>(DID_GET_PRESETS_OF_TYPE);

// ACTIONS
export const initializeApp = (): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const version = await doGetVersion();
    dispatch(didGetVersion(version));

    const servers = await doGetServers();
    dispatch(didGetServers(servers));

    const presetCollection = await doFetchAllPresets();
    setEffectTypes(presetCollection);

    dispatch(didGetAllPresets(presetCollection));

    dispatch(didInitializeApp());
};
export const fetchPresetsOfType = (effectType: EffectType): ThunkAction<void, RootState, null, AnyAction> => async dispatch => {
    const presets = await doFetchPresetsOfType(effectType);
    dispatch(didGetPresetsOfType({ effectType, presets }));
};
