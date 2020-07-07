package model

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
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
