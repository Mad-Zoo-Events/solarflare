import {
    AppAction,
    DID_GET_ALL_PRESETS,
    DID_GET_PRESETS_OF_TYPE,
    DID_GET_SERVERS,
    DID_GET_STAGES,
    DID_GET_VERSION,
    DID_INITIALIZE_APP
} from "./AppActions";
import { AppState } from "./AppState";
import * as et from "./domain/EffectType";
import {
    CommandPreset,
    DragonPreset,
    LaserPreset,
    ParticlePreset,
    PotionPreset,
    TimeshiftPreset
} from "./domain/presets";

const initialState: AppState = {
    isInitialized: false,
    version: "?",
    servers: [],
    stages: [],
    presets: {
        commandPresets: [],
        dragonPresets: [],
        laserPresets: [],
        particlePresets: [],
        potionPresets: [],
        timeshiftPresets: []
    }
};

function appReducer (
    // eslint-disable-next-line default-param-last
    state: AppState = initialState,
    action: AppAction
): AppState {
    switch (action.type) {
    case DID_INITIALIZE_APP:
        return {
            ...state,
            isInitialized: true
        };
    case DID_GET_VERSION:
        return {
            ...state,
            version: action.payload
        };
    case DID_GET_SERVERS:
        return {
            ...state,
            servers: action.payload
        };
    case DID_GET_STAGES:
        return {
            ...state,
            stages: action.payload
        };
    case DID_GET_ALL_PRESETS:
        return {
            ...state,
            presets: action.payload
        };
    case DID_GET_PRESETS_OF_TYPE:
        switch (action.payload.effectType) {
        case et.Command:
            return {
                ...state,
                presets: {
                    ...state.presets,
                    commandPresets: action.payload.presets as CommandPreset[]
                }
            };
        case et.Dragon:
            return {
                ...state,
                presets: {
                    ...state.presets,
                    dragonPresets: action.payload.presets as DragonPreset[]
                }
            };
        case et.Laser:
            return {
                ...state,
                presets: {
                    ...state.presets,
                    laserPresets: action.payload.presets as LaserPreset[]
                }
            };
        case et.Particle:
            return {
                ...state,
                presets: {
                    ...state.presets,
                    particlePresets: action.payload.presets as ParticlePreset[]
                }
            };
        case et.Potion:
            return {
                ...state,
                presets: {
                    ...state.presets,
                    potionPresets: action.payload.presets as PotionPreset[]
                }
            };
        case et.Timeshift:
            return {
                ...state,
                presets: {
                    ...state.presets,
                    timeshiftPresets: action.payload.presets as TimeshiftPreset[]
                }
            };
        default:
            return state;
        }
    default:
        return state;
    }
}

export default appReducer;
