package model

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
	case LightningEffectType:
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
