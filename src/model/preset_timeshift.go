package model

// TimeshiftEffectPreset is the domain and request/response model for the timeshift effect
type TimeshiftEffectPreset struct {
	Preset

	TimeshiftEffects []TimeshiftEffect `json:"timeshiftEffects"`
}

// TimeshiftEffect contains parameters for the timeshift effect
type TimeshiftEffect struct {
	// Amount of ticks to skip per server tick; 1000 ticks = one hour
	Amount int `json:"amount"`
}
