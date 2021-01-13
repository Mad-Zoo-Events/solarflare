import React, { ReactElement } from "react";
import { connect } from "react-redux";
import * as ea from "../../../domain/EffectAction";
import * as et from "../../../domain/EffectType";
import { LaserPreset } from "../../../domain/presets";
import { RootState } from "../../../RootState";
import { getAccentColor } from "../../../utils/utils";
import PresetControlButton from "../PresetControlButton/PresetControlButton";
import ClockControls from "./ClockControls/ClockControls";
import "./PresetControl.scss";
import { PresetControlProps } from "./PresetControlProps";

const PresetControl = ({
    preset,
    runningEffects
}: PresetControlProps): ReactElement => {
    const { id, effectType, displayName } = preset;

    const runningEffect = runningEffects.get(id);
    const secondsRunning = runningEffect?.secondsRunning;
    const onBeatAttached = runningEffect?.onBeatClock;
    const offBeatAttached = runningEffect?.offBeatClock;

    if (!effectType) {
        return <span>?</span>;
    }

    const renderStartStop =
    effectType !== et.Command;

    const isGuardianLaser = effectType === et.Laser && (preset as LaserPreset).laserType !== "end";

    const color = getAccentColor(effectType);
    const coloredText = { borderColor: `var(--${color})`, color: `var(--${color})` };

    return (
        <div className="control-panel__visual-control">
            <span style={coloredText}>{displayName}</span>

            {effectType === et.Command && <>
                <PresetControlButton preset={preset} action={ea.Trigger} color="steel" displayKeyBinding/>
            </>}

            {effectType === et.Dragon && <>
                <PresetControlButton preset={preset} action={ea.Restart} color="orange"/>
            </>}

            {effectType === et.Laser && isGuardianLaser && <>
                <PresetControlButton preset={preset} action={ea.Trigger} color="indigo"/>
            </>}

            {effectType === et.Particle && <>
                <PresetControlButton preset={preset} action={ea.Trigger} color="orange"/>
            </>}

            {renderStartStop && <>
                <PresetControlButton preset={preset} action={ea.Start} color="green" displayKeyBinding isRunning={secondsRunning !== undefined}/>
                <PresetControlButton preset={preset} action={ea.Stop} color="red" secondsRunning={secondsRunning}/>
            </>}

            <ClockControls onBeatAttached={onBeatAttached} offBeatAttached={offBeatAttached} />
        </div>
    );
};

function mapStateToProps (state: RootState) {
    const { runningEffects } = state.controlpanel;

    return {
        runningEffects
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetControl);
