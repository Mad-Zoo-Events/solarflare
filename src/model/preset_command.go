package model

// ************** //
// INTERNAL MODEL //
// ************** //

// CommandEffectPreset is the domain model for commands
type CommandEffectPreset struct {
	Preset

	Commands []string `json:"commands"`
}

// ********* //
// API MODEL //
// ********* //

// CommandEffectPresetAPI is the request/response model for command presets
type CommandEffectPresetAPI struct {
	Preset

	Commands []Command `json:"commands"`
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
		Preset:   preset.Preset,
		Commands: commands,
	}
}

// FromAPI transforms the API model to the internal model
func (preset CommandEffectPresetAPI) FromAPI() CommandEffectPreset {
	commands := []string{}
	for i := range preset.Commands {
		commands = append(commands, preset.Commands[i].CommandString)
	}
	return CommandEffectPreset{
		Preset:   preset.Preset,
		Commands: commands,
	}
}
