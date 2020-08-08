package model

import (
	"strconv"
	"strings"
)

// IsAllowedOn checks whether the effect type passed is valid for the given action
func (action EffectAction) IsAllowedOn(effectType EffectType) bool {
	switch effectType {
	case ParticleEffectType:
		if action == TriggerEffectAction ||
			action == StartEffectAction ||
			action == StopEffectAction {
			return true
		}
	case DragonEffectType:
		if action == StartEffectAction ||
			action == RestartEffectAction ||
			action == StopEffectAction {
			return true
		}
	case TimeshiftEffectType:
		if action == StartEffectAction ||
			action == StopEffectAction {
			return true
		}
	case PotionEffectType:
		if action == StartEffectAction ||
			action == StopEffectAction {
			return true
		}
	case TargetedLaserEffectType:
		if action == StartEffectAction ||
			action == StopEffectAction {
			return true
		}
	case EndLaserEffectType:
		if action == StartEffectAction ||
			action == StopEffectAction ||
			action == TriggerEffectAction {
			return true
		}
	case BossbarEffectType:
		if action == SetBossbarAction ||
			action == ClearBossbarAction {
			return true
		}
	}

	return false
}

// TramsformFromUI transforms UI specific values to the main model
func (preset *ParticleEffectPreset) TramsformFromUI() {
	for i := range preset.ParticleEffects {
		effect := &preset.ParticleEffects[i]

		pointIDs := []int{}
		for _, p := range strings.Split(effect.UIRegionPointIDs, ",") {
			point, err := strconv.Atoi(p)
			if err == nil {
				pointIDs = append(pointIDs, point)
			}
		}

		effect.Region = Region{
			Density:    convertDensity(float64(effect.UIRegionDensity), true),
			Equation:   effect.UIRegionEquation,
			PointIDs:   pointIDs,
			Randomize:  effect.UIRegionRandomize,
			RegionType: effect.UIRegionRegionType,
		}
	}
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *ParticleEffectPreset) TransformToUI() {
	for i := range preset.ParticleEffects {
		effect := &preset.ParticleEffects[i]
		region := effect.Region

		pointIDs := ""
		for _, p := range region.PointIDs {
			pointIDs = pointIDs + strconv.Itoa(p) + ","
		}
		pointIDs = strings.TrimSuffix(pointIDs, ",")

		effect.UIRegionDensity = int(convertDensity(region.Density, false))
		effect.UIRegionEquation = region.Equation
		effect.UIRegionPointIDs = pointIDs
		effect.UIRegionRandomize = region.Randomize
		effect.UIRegionRegionType = region.RegionType
	}

	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}

	preset.UIAllowedParticleEffects = MinecraftParticleEffects
	preset.UIAllowedRegionTypes = RegionTypes
}

func convertDensity(density float64, fromUI bool) float64 {
	m := 5.0404E-05
	n := -4.0404E-05

	if fromUI {
		return m*density + n
	}

	return (density - n) / m
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *DragonEffectPreset) TransformToUI() {
	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *TimeshiftEffectPreset) TransformToUI() {
	for i := range preset.TimeshiftEffects {
		effect := &preset.TimeshiftEffects[i]
		effect.UIPercentOfDayToSkipPerSecond = effect.Amount / 12
	}

	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}
}

// TramsformFromUI transforms UI specific values to the main model
func (preset *TimeshiftEffectPreset) TramsformFromUI() {
	for i := range preset.TimeshiftEffects {
		effect := &preset.TimeshiftEffects[i]
		effect.Amount = effect.UIPercentOfDayToSkipPerSecond * 12
	}
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *PotionEffectPreset) TransformToUI() {
	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}

	preset.UIAllowedPotionEffects = MinecraftPotionEffects
}
