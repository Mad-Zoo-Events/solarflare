package controller

import (
	"net/url"

	"github.com/go-playground/form/v4"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

var decoder *form.Decoder

func init() {
	decoder = form.NewDecoder()
}

func unmarshalParticlePreset(preset *model.ParticleEffectPreset, values url.Values) error {
	err := decoder.Decode(preset, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from UI request", err)
	}

	preset.TramsformFromUI()

	return nil
}

func unmarshalDragonPreset(preset *model.DragonEffectPreset, values url.Values) error {
	err := decoder.Decode(preset, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from UI request", err)
	}

	return nil
}

func unmarshalTimeshiftPreset(preset *model.TimeshiftEffectPreset, values url.Values) error {
	err := decoder.Decode(preset, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from UI request", err)
	}

	preset.TramsformFromUI()

	return nil
}

func unmarshalPotionPreset(preset *model.PotionEffectPreset, values url.Values) error {
	err := decoder.Decode(preset, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from UI request", err)
	}

	return nil
}

func unmarshalLaserPreset(preset *model.LaserEffectPreset, values url.Values) error {
	err := decoder.Decode(preset, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from UI request", err)
	}

	preset.TransformFromUI()

	return nil
}

func unmarshalCommandPreset(preset *model.CommandEffectPreset, values url.Values) error {
	err := decoder.Decode(preset, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from UI request", err)
	}

	preset.TransformFromUI()

	return nil
}

func getActiveServerIDs() []string {
	activeServerIDs := []string{}

	cfg := config.Get()
	for _, server := range cfg.Servers {
		if server.IsActive {
			activeServerIDs = append(activeServerIDs, server.ID)
		}
	}

	return activeServerIDs
}

func contains(arr []string, str string) bool {
	for _, e := range arr {
		if e == str {
			return true
		}
	}
	return false
}
