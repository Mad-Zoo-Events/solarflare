import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { ClockSubscriptionOptions } from "../../../domain/client/ClockSubscriptionOptions";
import * as ea from "../../../domain/EffectAction";
import * as et from "../../../domain/EffectType";
import { LaserPreset } from "../../../domain/presets";
import { RootState } from "../../../RootState";
import { getAccentColor } from "../../../utils/utils";
import { selectOffBeatAttached, selectOnBeatAttached, selectSecondsRunning } from "../ControlPanelSelectors";
import PresetControlButton from "../PresetControlButton/PresetControlButton";
import ClockControls from "./ClockControls/ClockControls";
import "./PresetControl.scss";
import { PresetControlProps } from "./PresetControlProps";

const PresetControl = ({
    preset,
    secondsRunning,
    onBeatAttached,
    offBeatAttached
}: PresetControlProps): ReactElement => {
    const { id, effectType, displayName } = preset;

    if (!effectType) {
        return <span>?</span>;
    }

    const isRunning = secondsRunning !== undefined;
    const isRunningButNotOnClock = isRunning && !onBeatAttached && !offBeatAttached;
    const isGuardianLaser = effectType === et.Laser && (preset as LaserPreset).laserType !== "end";
    const renderStartStop = effectType !== et.Command;

    const color = getAccentColor(effectType);
    const coloredText = { borderColor: `var(--${color})`, color: `var(--${color})` };

    const subscriptionOptions: ClockSubscriptionOptions = {
        presetId: id,
        effectType,
        isRunning,
        offBeat: false
    };

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
                <PresetControlButton
                    preset={preset}
                    action={ea.Start}
                    color="green"
                    displayKeyBinding
                    isRunning={isRunningButNotOnClock}
                    denyClick={isRunningButNotOnClock}
                />
                <PresetControlButton
                    preset={preset}
                    action={ea.Stop}
                    color="red"
                    secondsRunning={secondsRunning}
                    denyClick={onBeatAttached || offBeatAttached}
                />
            </>}

            <ClockControls
                onBeatAttached={onBeatAttached}
                offBeatAttached={offBeatAttached}
                subscriptionOptions={subscriptionOptions}
            />
        </div>
    );
};

function mapStateToProps (state: RootState, { preset }: PresetControlProps) {
    const secondsRunning = selectSecondsRunning(state, preset.id);
    const onBeatAttached = selectOnBeatAttached(state, preset.id);
    const offBeatAttached = selectOffBeatAttached(state, preset.id);

    return {
        secondsRunning,
        onBeatAttached,
        offBeatAttached
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(PresetControl);
