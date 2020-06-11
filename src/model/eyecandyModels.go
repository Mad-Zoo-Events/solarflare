package model

// Action represents the action to be performed on the visual effect (e.g. start, stop, restart...)
type Action string

const (
	// TriggerVisualAction triggers a visual effect
	TriggerVisualAction = Action("TRIGGER")
	// StartVisualAction starts a visual effect
	StartVisualAction = Action("START")
	// RestartVisualAction restarts a visual effect
	RestartVisualAction = Action("RESTART")
	// StopVisualAction stops a visual effect
	StopVisualAction = Action("STOP")
)

// ParticleEffectRequest is the request model for particle effects
type ParticleEffectRequest struct {
	Name     string
	Action   Action
	PointIDs []int
}

// DragonRequest is the request model for the dragon effect
type DragonRequest struct {
	Action  Action
	PointID int
	Static  *bool
}
