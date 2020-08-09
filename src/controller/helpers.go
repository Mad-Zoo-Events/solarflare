package controller

import (
	"net/url"

	"github.com/go-playground/form/v4"

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
