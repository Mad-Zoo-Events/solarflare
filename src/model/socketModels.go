package model

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
	EffectUpdate *EffectUpdate `json:"effectUpdate"`
	ClockUpdate  *ClockUpdate  `json:"clockUpdate"`
	StatusUpdate *StatusUpdate `json:"statusUpdate"`
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

// StatusUpdate is the model used to send updates on network status to the UI
type StatusUpdate struct {
	RegisteredServerCount int `json:"registeredServerCount"`
}
