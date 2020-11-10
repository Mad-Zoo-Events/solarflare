package model

// ClockSubscriptionRequest is the model for inbound clock subscription requests
type ClockSubscriptionRequest struct {
	PresetID   string     `json:"presetId"`
	EffectType EffectType `json:"effectType"`
	IsRunning  bool       `json:"isRunning"`
	OffBeat    bool       `json:"offBeat"`
}

// ClockSpeedRequest is the model for inbound clock speed requests
type ClockSpeedRequest struct {
	BPM        float64 `json:"bpm"`
	NoteLength float64 `json:"noteLength"`
}
