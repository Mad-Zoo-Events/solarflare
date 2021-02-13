package model

import (
	"strconv"
	"strings"
)

// ************** //
// INTERNAL MODEL //
// ************** //

// LightningEffectPreset is the domain model for lightnings
type LightningEffectPreset struct {
	ID           string        `json:"id"`
	DisplayName  string        `json:"displayName"`
	Description  string        `json:"description"`
	KeyBinding   rune          `json:"keyBinding"`
	MIDIMappings []MIDIMapping `json:"midiMappings"`

	PointIDs []int `json:"pointIDs"`
}

// ********* //
// API MODEL //
// ********* //

// LightningEffectPresetAPI is the request/response model for lightning effect presets
type LightningEffectPresetAPI struct {
	ID           string        `json:"id"`
	DisplayName  string        `json:"displayName"`
	Description  string        `json:"description"`
	KeyBinding   rune          `json:"keyBinding"`
	MIDIMappings []MIDIMapping `json:"midiMappings"`

	PointIDList string `json:"pointIDList"` // Comma-separated list of point IDs
}

// ******************** //
// TO/FROM API REDUCERS //
// ******************** //

// ToAPI transforms the internal model to the API model
func (preset LightningEffectPreset) ToAPI() LightningEffectPresetAPI {
	pointIDBuilder := strings.Builder{}
	for _, p := range preset.PointIDs {
		pointIDBuilder.WriteString(strconv.Itoa(p))
		pointIDBuilder.WriteString(",")
	}

	return LightningEffectPresetAPI{
		ID:           preset.ID,
		DisplayName:  preset.DisplayName,
		Description:  preset.Description,
		KeyBinding:   preset.KeyBinding,
		MIDIMappings: preset.MIDIMappings,
		PointIDList:  strings.TrimSuffix(pointIDBuilder.String(), ","),
	}
}

// FromAPI transforms the API model to the internal model
func (preset LightningEffectPresetAPI) FromAPI() LightningEffectPreset {
	pointIDs := []int{}
	for _, p := range strings.Split(preset.PointIDList, ",") {
		if point, err := strconv.Atoi(p); err == nil {
			pointIDs = append(pointIDs, point)
		}
	}

	return LightningEffectPreset{
		ID:           preset.ID,
		DisplayName:  preset.DisplayName,
		Description:  preset.Description,
		KeyBinding:   preset.KeyBinding,
		MIDIMappings: preset.MIDIMappings,
		PointIDs:     pointIDs,
	}
}
