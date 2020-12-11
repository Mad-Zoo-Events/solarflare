package model

// CommandEffectPreset is the request model for commands
type CommandEffectPreset struct {
	ID          string   `json:"id"`
	DisplayName string   `json:"displayName"`
	Description string   `json:"description"`
	KeyBinding  rune     `json:"keyBinding"`
	Commands    []string `json:"commands"`
}

// CommandEffectPresetAPI is the inbount request and response model for command presets
type CommandEffectPresetAPI struct {
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

// ******************** //
// TO/FROM API REDUCERS //
// ******************** //

// ToAPI transforms the internal model to the API model
func (preset CommandEffectPreset) ToAPI() CommandEffectPresetAPI {
	commands := []Command{}
	for i := range preset.Commands {
		commands = append(commands, Command{CommandString: preset.Commands[i]})
	}
	return CommandEffectPresetAPI{
		ID:          preset.ID,
		DisplayName: preset.DisplayName,
		Description: preset.Description,
		KeyBinding:  preset.KeyBinding,
		Commands:    commands,
	}
}

// FromAPI transforms the API model to the internal model
func (preset CommandEffectPresetAPI) FromAPI() CommandEffectPreset {
	commands := []string{}
	for i := range preset.Commands {
		commands = append(commands, preset.Commands[i].CommandString)
	}
	return CommandEffectPreset{
		ID:          preset.ID,
		DisplayName: preset.DisplayName,
		Description: preset.Description,
		KeyBinding:  preset.KeyBinding,
		Commands:    commands,
	}
}
