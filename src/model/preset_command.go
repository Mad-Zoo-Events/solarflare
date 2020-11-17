package model

// CommandEffectPreset is the request model for commands
type CommandEffectPreset struct {
	ID          string   `json:"id" form:"id"`
	DisplayName string   `json:"displayName" form:"displayName"`
	Description string   `json:"description" form:"description"`
	KeyBinding  rune     `json:"keyBinding" form:"keyBinding"`
	Commands    []string `json:"commands" form:"command"`

	// UI specific models
	UIKeyBinding string `json:"-" form:"-"`
}

// CommandEffectPresetResponse is the response model for commands
type CommandEffectPresetResponse struct {
	ID          string    `json:"id"`
	DisplayName string    `json:"displayName"`
	Description string    `json:"description"`
	KeyBinding  rune      `json:"keyBinding"`
	Commands    []Command `json:"commands"`
}

// Command represents a single command
type Command struct {
	CommandString string `json:"command"`
}
