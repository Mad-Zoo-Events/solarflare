package model

import (
	"math"
	"reflect"
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
	case LaserEffectType:
		if action == StartEffectAction ||
			action == StopEffectAction ||
			action == TriggerEffectAction {
			return true
		}
	case CommandEffectType:
		if action == TriggerEffectAction {
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

// ****** //
// LEGACY //
// ****** //

// TransformFromUI transforms UI specific values to the main model
func (preset *ParticleEffectPreset) TransformFromUI() {
	for i := len(preset.ParticleEffects) - 1; i >= 0; i-- {
		effect := &preset.ParticleEffects[i]
		if reflect.DeepEqual(*effect, ParticleEffect{}) {
			preset.ParticleEffects = append(preset.ParticleEffects[:i], preset.ParticleEffects[i+1:]...)
			continue
		}

		pointIDs := []int{}
		for _, p := range strings.Split(effect.UIRegionPointIDs, ",") {
			point, err := strconv.Atoi(p)
			if err == nil {
				pointIDs = append(pointIDs, point)
			}
		}

		density := convertDensity(effect.UIRegionDensity, true)

		effect.Region = Region{
			Density:    &density,
			Equation:   &effect.UIRegionEquation,
			PointIDs:   pointIDs,
			Randomize:  &effect.UIRegionRandomize,
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

		density := 0.005
		if region.Density != nil {
			density = math.Round(convertDensity(*region.Density, false)*10) / 10
		}

		equation := ""
		if region.Equation != nil {
			equation = *region.Equation
		}

		randomize := false
		if region.Randomize != nil {
			randomize = *region.Randomize
		}

		effect.UIRegionDensity = density
		effect.UIRegionEquation = equation
		effect.UIRegionPointIDs = pointIDs
		effect.UIRegionRandomize = randomize
		effect.UIRegionRegionType = region.RegionType
	}

	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}

	preset.UIAllowedParticleEffects = MinecraftParticleEffects
	preset.UIAllowedRegionTypes = RegionTypes
}

// TransformFromUI transforms UI specific values to the main model
func (preset *DragonEffectPreset) TransformFromUI() {
	for i := range preset.DragonEffects {
		if reflect.DeepEqual(preset.DragonEffects[i], DragonEffect{}) {
			preset.DragonEffects = append(preset.DragonEffects[:i], preset.DragonEffects[i+1:]...)
		}
	}
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *DragonEffectPreset) TransformToUI() {
	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}
}

// TransformFromUI transforms UI specific values to the main model
func (preset *TimeshiftEffectPreset) TransformFromUI() {
	for i := range preset.TimeshiftEffects {
		if reflect.DeepEqual(preset.TimeshiftEffects[i], TimeshiftEffect{}) {
			preset.TimeshiftEffects = append(preset.TimeshiftEffects[:i], preset.TimeshiftEffects[i+1:]...)
			continue
		}

		effect := &preset.TimeshiftEffects[i]
		effect.Amount = effect.UIPercentOfDayToSkipPerSecond * 12
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

// TransformFromUI transforms UI specific values to the main model
func (preset *PotionEffectPreset) TransformFromUI() {
	for i := range preset.PotionEffects {
		if reflect.DeepEqual(preset.PotionEffects[i], PotionEffect{}) {
			preset.PotionEffects = append(preset.PotionEffects[:i], preset.PotionEffects[i+1:]...)
		}
	}
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *PotionEffectPreset) TransformToUI() {
	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}

	preset.UIAllowedPotionEffects = MinecraftPotionEffects
}

// TransformFromUI transforms UI specific values to the main model
func (preset *LaserEffectPreset) TransformFromUI() {
	for i := len(preset.LaserEffects) - 1; i >= 0; i-- {
		if reflect.DeepEqual(preset.LaserEffects[i], LaserEffect{}) {
			preset.LaserEffects = append(preset.LaserEffects[:i], preset.LaserEffects[i+1:]...)
		}
	}

	if preset.IsEndLaser {
		preset.IsNonPlayerTargeting = true
	}
}

// TransformToUI transforms UI specific values to the main model
func (preset *LaserEffectPreset) TransformToUI() {
	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}
}

// TransformFromUI transforms UI specific values to the main model
func (preset *CommandEffectPreset) TransformFromUI() {
	for i := len(preset.Commands) - 1; i >= 0; i-- {
		if preset.Commands[i] == "" {
			preset.Commands = append(preset.Commands[:i], preset.Commands[i+1:]...)
		}
	}
}

// TransformToUI transforms UI specific values to the main model
func (preset *CommandEffectPreset) TransformToUI() {
	if preset.KeyBinding != 0 {
		preset.UIKeyBinding = string(preset.KeyBinding)
	}
}
