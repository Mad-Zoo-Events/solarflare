package model

// UpdateType describes the type of update sent to the UI
type UpdateType string

// EffectUpdateType represents an action that was triggered on an effect
const EffectUpdateType UpdateType = "effect"

// ClockUpdateType represents an attachment to the clock
const ClockUpdateType UpdateType = "clock"

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
	UpdateType   UpdateType    `json:"updateType"`
	EffectUpdate *EffectUpdate `json:"effectUpdate"`
	ClockUpdate  *ClockUpdate  `json:"clockUpdate"`
}

// EffectUpdate is the model used to send updates on effect actions to the UI
type EffectUpdate struct {
	ID          string       `json:"id"`
	DisplayName string       `json:"displayName"`
	Action      EffectAction `json:"action"`

	ErrorMessage string `json:"errorMessage"`
}

// ClockUpdate is the model used to send updates on clock subscriptions to the UI
type ClockUpdate struct {
	ID     string      `json:"id"`
	Action ClockAction `json:"action"`
}
