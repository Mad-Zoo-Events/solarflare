package model

// Action represents the action to be performed on the visual (e.g. start, stop, restart...)
type Action string

const (
	// StartVisualAction starts a visual effect
	StartVisualAction = Action("start")
	// StopVisualAction stops a visual effect
	StopVisualAction = Action("stop")
	// RestartVisualAction restarts a visual effect
	RestartVisualAction = Action("restart")
)
