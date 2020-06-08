package model

// Action represents the action to be performed on the visual (e.g. start, stop, restart...)
type Action string

const (
	// TriggerVisualAction triggers a visual effect
	TriggerVisualAction = Action("trigger")
	// StartVisualAction starts a visual effect
	StartVisualAction = Action("start")
	// RestartVisualAction restarts a visual effect
	RestartVisualAction = Action("restart")
	// StopVisualAction stops a visual effect
	StopVisualAction = Action("stop")
)

// VisualControl contains information about an effect used for templates
type VisualControl struct {
	Name         string
	AllowTrigger bool
	AllowStart   bool
	AllowRestart bool
	AllowStop    bool
}

// ControlPanel holds all data to be rendered on the control panel website
type ControlPanel struct {
	Effects []VisualControl
}
