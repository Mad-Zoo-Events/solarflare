package model

// TimeshiftEffectPreset is the request model for the timeshift effect
type TimeshiftEffectPreset struct {
	ID               string            `json:"id" form:"id"`
	DisplayName      string            `json:"displayName" form:"displayName"`
	Description      string            `json:"description" form:"description"`
	KeyBinding       rune              `json:"keyBinding" form:"keyBinding"`
	TimeshiftEffects []TimeshiftEffect `json:"timeshiftEffects" form:"effect"`

	// UI specific models
	UIKeyBinding string `json:"-" form:"-"`
}

// TimeshiftEffect contains parameters for the timeshift effect
type TimeshiftEffect struct {
	// Amount of ticks to skip per server tick; 1000 ticks = one hour
	Amount int `json:"amount" form:"-"`

	// UI specific models
	UIPercentOfDayToSkipPerSecond int `json:"-" form:"percentToSkip"`
}
