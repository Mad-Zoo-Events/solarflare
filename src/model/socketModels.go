package model

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
	EffectUpdate     *EffectUpdate     `json:"effectUpdate"`
	ClockUpdate      *ClockUpdate      `json:"clockUpdate"`
	ClockSpeedUpdate *ClockSpeedUpdate `json:"clockSpeedUpdate"`
	StatusUpdate     *StatusUpdate     `json:"statusUpdate"`
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

// ClockSpeedUpdate is the model used to send updates on clock subscriptions to the UI
type ClockSpeedUpdate struct {
	ClockSpeedBPM        float64 `json:"clockSpeedBpm"`
	ClockSpeedMultiplier float64 `json:"clockSpeedMultiplier"`
	//TODO:
	// - only update UI if you're not the initiator (flag on UI)
	// - wait until there's no subsequent request for 3 seconds before updating
}

// StatusUpdate is the model used to send updates on network status to the UI
type StatusUpdate struct {
	RegisteredServerCount int `json:"registeredServerCount"`
}
