package utils

import (
	"fmt"
	"net/http"

	"github.com/go-playground/form/v4"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

var decoder *form.Decoder

// FindPreset returns the preset identified by the ID passed, or an error if it couldn't be found
func FindPreset(id string) (interface{}, error) {
	cfg := config.Get()
	for _, p := range cfg.ParticleEffectPresets {
		if p.ID == id {
			return p, nil
		}
	}

	for _, p := range cfg.DragonEffectPresets {
		if p.ID == id {
			return p, nil
		}
	}

	return nil, cserror.New(cserror.PresetNotFound, fmt.Sprintf("Preset with ID %s not found", id), nil)
}

// GetUIDragonPreset parses and converts a dragon preset request to the candyshop format
func GetUIDragonPreset(r *http.Request) (*model.DragonEffectPreset, error) {
	err := r.ParseForm()
	if err != nil {
		return nil, cserror.New(cserror.Encoding, "Error parsing form from UI", err)
	}

	decoder = form.NewDecoder()

	var preset model.DragonEffectPreset

	err = decoder.Decode(&preset, r.PostForm)
	if err != nil {
		return nil, cserror.New(cserror.Encoding, "Error parsing data from UI request", err)
	}

	return &preset, nil
}
