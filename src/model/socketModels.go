package model

// UIUpdate is the model used to send updates to the UI
type UIUpdate struct {
	EffectUpdate     *EffectUpdate     `json:"effectUpdate,omitempty"`
	BossbarUpdate    *BossbarUpdate    `json:"bossbarUpdate,omitempty"`
	ClockUpdate      *ClockUpdate      `json:"clockUpdate,omitempty"`
	ClockSpeedUpdate *ClockSpeedUpdate `json:"clockSpeedUpdate,omitempty"`
	ServerUpdate     *ServerUpdate     `json:"serverUpdate,omitempty"`
	StageUpdate      *StageUpdate      `json:"stageUpdate,omitempty"`
	CommandUpdate    *CommandUpdate    `json:"commandUpdate,omitempty"`
}

// EffectUpdate is the model used to send updates on effect actions to the UI
type EffectUpdate struct {
	ID          *string       `json:"id,omitempty"`
	EffectType  *EffectType   `json:"effectType,omitempty"`
	DisplayName *string       `json:"displayName,omitempty"`
	Action      *EffectAction `json:"action,omitempty"`

	ErrorMessage *string `json:"errorMessage,omitempty"`

	StopAll *StopAllRequest `json:"stopAll,omitempty"`
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

// ServerUpdate is the model used to send an update for when a server selection has been made
type ServerUpdate struct {
	Action  ServerAction `json:"action"`
	Servers []Server     `json:"servers"`
}

// StageUpdate is the model used to send the update for when a different stage has been selected
type StageUpdate struct {
	Stages        []string `json:"stages"`
	SelectedStage string   `json:"selectedStage"`
}

// CommandUpdate is the model used to send the update for when a command was executed
type CommandUpdate struct {
	Command string `json:"command"`

	ErrorMessage string `json:"errorMessage"`
}
