package model

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
	EffectUpdate     *EffectUpdate     `json:"effectUpdate"`
	BossbarUpdate    *BossbarUpdate    `json:"bossbarUpdate"`
	ClockUpdate      *ClockUpdate      `json:"clockUpdate"`
	ClockSpeedUpdate *ClockSpeedUpdate `json:"clockSpeedUpdate"`
	StatusUpdate     *StatusUpdate     `json:"statusUpdate"`
	StageUpdate      *StageUpdate      `json:"stageUpdate"`
	CommandUpdate    *CommandUpdate    `json:"commandUpdate"`
}

// EffectUpdate is the model used to send updates on effect actions to the UI
type EffectUpdate struct {
	ID          string       `json:"id"`
	EffectType  EffectType   `json:"effectType"`
	DisplayName string       `json:"displayName"`
	Action      EffectAction `json:"action"`

	ErrorMessage string `json:"errorMessage"`

	StopAll *StopAllRequest `json:"stopAll"`
}

// BossbarUpdate is the model used to send updates on the bossbar to the UI
type BossbarUpdate struct {
	Text   string       `json:"text"`
	Color  string       `json:"color"`
	Action EffectAction `json:"action"`
}

// ClockUpdate is the model used to send updates on clock subscriptions to the UI
type ClockUpdate struct {
	ID         string      `json:"id"`
	EffectType EffectType  `json:"effectType"`
	IsOffBeat  bool        `json:"isOffBeat"`
	Action     ClockAction `json:"action"`
}

// ClockSpeedUpdate is the model used to send updates on clock subscriptions to the UI
type ClockSpeedUpdate struct {
	ClockSpeedBPM        float64 `json:"clockSpeedBpm"`
	ClockSpeedMultiplier float64 `json:"clockSpeedMultiplier"`
}

// StatusUpdate is the model used to send updates on network status to the UI
type StatusUpdate struct {
	ActiveServerIDs []string `json:"activeServerIDs"`
}

// StageUpdate is the model used to send the update for when a different stage has been selected
type StageUpdate struct {
	SelectedStage string `json:"selectedStage"`
}

// CommandUpdate is the model used to send the update for when a command was executed
type CommandUpdate struct {
	Command string `json:"command"`

	ErrorMessage string `json:"errorMessage"`
}
