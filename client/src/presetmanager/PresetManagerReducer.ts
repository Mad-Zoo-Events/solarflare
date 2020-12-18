import * as et from "../domain/EffectType";
import { CommandPreset, DragonPreset, LaserPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "../domain/presets";
import { DID_FINISH_TEST, DID_GET_ALL_PRESETS, DID_GET_PRESETS_OF_TYPE, DID_SHOW_TOAST, PresetManagerAction, SHOULD_CLOSE_PRESET_MODIFIER, SHOULD_OPEN_PRESET_MODIFIER, SHOULD_SHOW_TOAST, WILL_START_TEST } from "./PresetManagerActions";
import { PresetManagerState } from "./PresetManagerState";

const initialState: PresetManagerState = {
    presets: {
        commandPresets: [],
        dragonPresets: [],
        laserPresets: [],
        particlePresets: [],
        potionPresets: [],
        timeshiftPresets: []
    },
    testIsRunning: false
};

function presetManagerReducer (
    // eslint-disable-next-line default-param-last
    state: PresetManagerState = initialState,
    action: PresetManagerAction
): PresetManagerState {
    switch (action.type) {
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
    case SHOULD_OPEN_PRESET_MODIFIER:
        return {
            ...state,
            presetToEdit: action.payload
        };
    case SHOULD_CLOSE_PRESET_MODIFIER:
        return {
            ...state,
            presetToEdit: undefined
        };
    case WILL_START_TEST:
        return {
            ...state,
            testIsRunning: true
        };
    case DID_FINISH_TEST:
        return {
            ...state,
            testIsRunning: false
        };
    case SHOULD_SHOW_TOAST:
        return {
            ...state,
            toast: action.payload
        };
    case DID_SHOW_TOAST:
        return {
            ...state,
            toast: undefined
        };
    default:
        return state;
    }
}

export default presetManagerReducer;
