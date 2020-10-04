package model

// StopAllRequest is the model used for both inbound stop all requests and corresponding UI updates
type StopAllRequest struct {
	StopEffects  bool `json:"stopEffects"`
	DetachClocks bool `json:"detachClocks"`
}
