package model

// MIDIMapping describes which MIDI action is assigned to which behavior on a preset
type MIDIMapping struct {
	Key      int    `json:"key"`
	Channel  int    `json:"channel"`
	Behavior string `json:"behavior"`
}
