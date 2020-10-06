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
