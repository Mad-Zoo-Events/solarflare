package model

// Preset defines the attributes shared across all presets
type Preset struct {
	ID           string        `json:"id"`
	DisplayName  string        `json:"displayName"`
	Description  string        `json:"description"`
	KeyBinding   rune          `json:"keyBinding"`
	MIDIMappings []MIDIMapping `json:"midiMappings"`
}

// MIDIMapping describes which MIDI action is assigned to which behavior on a preset
type MIDIMapping struct {
	Key      int    `json:"key"`
	Channel  int    `json:"channel"`
	Behavior string `json:"behavior"`
}
