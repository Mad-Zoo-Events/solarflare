package utils

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/eynorey/candyshop/src/model"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

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

	effects := []model.DragonEffect{}

	i := 0
	for {
		pointStr := r.PostFormValue(fmt.Sprintf("effect-pointId[%d]", i))
		if pointStr == "" {
			break
		}

		point, err := strconv.Atoi(pointStr)
		if err != nil {
			break
		}

		static := false
		if r.PostFormValue(fmt.Sprintf("effect-static[%d]", i)) == "on" {
			static = true
		}

		effects = append(effects, model.DragonEffect{
			PointID: point,
			Static:  static,
		})

		i++
	}

	preset := model.DragonEffectPreset{
		ID:            r.PostFormValue("id"),
		DisplayName:   r.PostFormValue("name"),
		Description:   r.PostFormValue("description"),
		DragonEffects: effects,
	}

	fmt.Println(preset)

	return &preset, nil
}
