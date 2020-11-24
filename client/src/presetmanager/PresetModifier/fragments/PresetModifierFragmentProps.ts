import { UseFormMethods } from "react-hook-form";
import { Preset } from "../../../domain/presets/Preset";

export interface PresetModifierFragmentProps {
    preset: Preset
    formMethods: UseFormMethods<Preset>
}
