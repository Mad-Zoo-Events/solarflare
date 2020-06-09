package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/eynorey/candyshop/src/client"

	"github.com/eynorey/candyshop/src/model"
)

// DoParticleEffect compiles and sends an action for a particle effect
func DoParticleEffect(name string, action model.Action) error {
	log.Printf("Performing %s on %s", action, name)

	request := model.ParticleEffectRequest{
		Name:     name,
		Action:   action,
		PointIDs: []int{0},
	}

	body, err := json.Marshal(request)
	if err != nil {
		return err
	}

	err = client.Do(http.MethodPost, "effect/particle", body)
	if err != nil {
		return err
	}

	return nil
}

// DoDragon compiles and sends an action for the dragon effect
func DoDragon(action model.Action) error {
	return nil
}
