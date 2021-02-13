package model

// ************** //
// INTERNAL MODEL //
// ************** //

// CommandEffectPreset is the domain model for commands
type CommandEffectPreset struct {
	ID           string        `json:"id"`
	DisplayName  string        `json:"displayName"`
	Description  string        `json:"description"`
	KeyBinding   rune          `json:"keyBinding"`
	MIDIMappings []MIDIMapping `json:"midiMappings"`

	Commands []string `json:"commands"`
}

// ********* //
// API MODEL //
// ********* //

// CommandEffectPresetAPI is the request/response model for command presets
type CommandEffectPresetAPI struct {
	ID           string        `json:"id"`
	DisplayName  string        `json:"displayName"`
	Description  string        `json:"description"`
	KeyBinding   rune          `json:"keyBinding"`
	MIDIMappings []MIDIMapping `json:"midiMappings"`
	Commands     []Command     `json:"commands"`
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
		ID:           preset.ID,
		DisplayName:  preset.DisplayName,
		Description:  preset.Description,
		KeyBinding:   preset.KeyBinding,
		MIDIMappings: preset.MIDIMappings,
		Commands:     commands,
	}
}

// FromAPI transforms the API model to the internal model
func (preset CommandEffectPresetAPI) FromAPI() CommandEffectPreset {
	commands := []string{}
	for i := range preset.Commands {
		commands = append(commands, preset.Commands[i].CommandString)
	}
	return CommandEffectPreset{
		ID:           preset.ID,
		DisplayName:  preset.DisplayName,
		Description:  preset.Description,
		KeyBinding:   preset.KeyBinding,
		MIDIMappings: preset.MIDIMappings,
		Commands:     commands,
	}
}
