package model

// UpdateType describes the type of update sent to the UI
type UpdateType string

// EffectUpdateType represents an action that was triggered on an effect
const EffectUpdateType UpdateType = "effect"

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
	UpdateType   UpdateType    `json:"updateType"`
	EffectUpdate *EffectUpdate `json:"effectUpdate"`
}

// EffectUpdate is the model used to send updates on effect actions to the UI
type EffectUpdate struct {
	ID          string       `json:"id"`
	DisplayName string       `json:"displayName"`
	Action      EffectAction `json:"action"`

	ErrorMessage string `json:"errorMessage"`
}
