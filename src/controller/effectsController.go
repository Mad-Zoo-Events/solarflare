package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/eynorey/candyshop/src/client"

	"github.com/eynorey/candyshop/src/model"
)

const (
	endpointParticleEffect = "effects/particle"
	endpointDragon         = "effects/dragon"
)

// DoParticleEffect compiles and sends an action for a particle effect
func DoParticleEffect(name string, action model.Action) error {
	log.Printf("Attempting to perform %s on particle effect %s", action, name)

	request := model.ParticleEffectRequest{
		Name:     name,
		Action:   action,
		PointIDs: []int{0},
	}

	body, err := json.Marshal(request)
	if err != nil {
		log.Fatalf("Failed to marshal particle effect request: %s", err.Error())
		return err
	}

	err = client.Do(http.MethodPost, endpointParticleEffect, body)
	if err != nil {
		log.Fatalf("Failed to perform %s on particle effect %s: %s", action, name, err.Error())
		return err
	}

	log.Printf("Successfully performed %s on particle effect %s", action, name)
	return nil
}

// DoDragon compiles and sends an action for the dragon effect
func DoDragon(action model.Action) error {
	log.Printf("Attempting to perform %s on the dragon", action)

	request := model.DragonRequest{
		Action:  action,
		PointID: 0,
	}

	body, err := json.Marshal(request)
	if err != nil {
		log.Fatalf("Failed to marshal dragon request: %s", err.Error())
		return err
	}

	err = client.Do(http.MethodPost, endpointDragon, body)
	if err != nil {
		log.Fatalf("Failed to perform %s on the dragon: %s", action, err.Error())
		return err
	}

	log.Printf("Successfully performed %s on the dragon", action)
	return nil
}
