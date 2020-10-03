package model

// CommandRequest is the model used for running a command on the console
type CommandRequest struct {
	Command string `json:"command" form:"command"`
}
