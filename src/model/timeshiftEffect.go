package model

// TimeshiftEffectPreset is the request model for the timeshift effect
type TimeshiftEffectPreset struct {
	ID          string `json:"id" form:"id"`
	DisplayName string `json:"displayName" form:"displayName"`
	Description string `json:"description" form:"description"`
	Amount      int    `json:"amount" form:"-"` // Amount of ticks to skip per server tick; 1000 ticks = one hour

	// UI specific models
	UIPercentOfDayToSkipPerSecond int `json:"-" form:"percentToSkip"`
}
