import { HandleThunkActionCreator } from "react-redux";
import { EffectType } from "../../../domain/EffectType";
import { Preset } from "../../../domain/presets/Preset";
import { closePresetModifier, testPreset, upsertPreset } from "../PresetManagerActions";

export interface PresetModifierProps {
    preset: Preset
    effectType: EffectType
    testIsRunning: boolean

    onClose: HandleThunkActionCreator<typeof closePresetModifier>
    onSubmitForm: HandleThunkActionCreator<typeof upsertPreset>
    onTestPreset: HandleThunkActionCreator<typeof testPreset>
}
