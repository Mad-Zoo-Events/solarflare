package model

// ClockSubscriptionRequest is the model for inbound clock subscription requests
type ClockSubscriptionRequest struct {
	IsRunning bool `json:"isRunning"`
	OffBeat   bool `json:"offBeat"`
}
