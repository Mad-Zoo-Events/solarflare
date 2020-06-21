package model

// TimeshiftEffectPreset is the request model for the timeshift effect
type TimeshiftEffectPreset struct {
	ID               string            `json:"id" form:"id"`
	DisplayName      string            `json:"displayName" form:"displayName"`
	Description      string            `json:"description" form:"description"`
	TimeshiftEffects []TimeshiftEffect `json:"timeshiftEffects" form:"effect"`
}

// TimeshiftEffect contains parameters for the timeshift effect
type TimeshiftEffect struct {
	// Amount of ticks to skip per server tick; 1000 ticks = one hour
	Amount int `json:"amount" form:"-"`

	// UI specific models
	UIPercentOfDayToSkipPerSecond int `json:"-" form:"percentToSkip"`
}
