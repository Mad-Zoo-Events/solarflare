import * as et from "../domain/EffectType";
import { CommandPreset, DragonPreset, LaserPreset, ParticlePreset, PotionPreset, TimeshiftPreset } from "../domain/presets";
import { DID_GET_ALL_PRESETS, DID_GET_PRESETS_OF_TYPE, PresetManagerAction } from "./PresetManagerActions";
import { PresetManagerState } from "./PresetManagerState";

const initialState: PresetManagerState = {
    presets: {
        commandPresets: [],
        dragonPresets: [],
        laserPresets: [],
        particlePresets: [],
        potionPresets: [],
        timeshiftPresets: []
    }
};

function presetManagerReducer (
    // eslint-disable-next-line default-param-last
    state: PresetManagerState = initialState,
    action: PresetManagerAction
): PresetManagerState {
    switch (action.type) {
    case DID_GET_ALL_PRESETS:
        return {
            presets: action.payload
        };
    case DID_GET_PRESETS_OF_TYPE:
        switch (action.payload.effectType) {
        case et.Command:
            return {
                presets: {
                    ...state.presets,
                    commandPresets: action.payload.presets as CommandPreset[]
                }
            };
        case et.Dragon:
            return {
                presets: {
                    ...state.presets,
                    dragonPresets: action.payload.presets as DragonPreset[]
                }
            };
        case et.Laser:
            return {
                presets: {
                    ...state.presets,
                    laserPresets: action.payload.presets as LaserPreset[]
                }
            };
        case et.Particle:
            return {
                presets: {
                    ...state.presets,
                    particlePresets: action.payload.presets as ParticlePreset[]
                }
            };
        case et.Potion:
            return {
                presets: {
                    ...state.presets,
                    potionPresets: action.payload.presets as PotionPreset[]
                }
            };
        case et.Timeshift:
            return {
                presets: {
                    ...state.presets,
                    timeshiftPresets: action.payload.presets as TimeshiftPreset[]
                }
            };
        }
        return {
            presets: state.presets
        };
    default:
        return state;
    }
}

export default presetManagerReducer;
