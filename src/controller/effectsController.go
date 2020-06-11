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
func DoParticleEffect(r model.InboundParticleEffectRequest) error {
	log.Printf("Attempting to perform %s on particle effect %s", r.Action, r.EffectName)

	request := model.ParticleEffectRequest{
		Name:     r.EffectName,
		Action:   model.Action(r.Action),
		PointIDs: []int{0},
	}

	body, err := json.Marshal(request)
	if err != nil {
		log.Printf("Failed to marshal particle effect request: %s", err.Error())
		return err
	}

	err = client.Do(http.MethodPost, endpointParticleEffect, body)
	if err != nil {
		log.Printf("Failed to perform %s on particle effect %s: %s", r.Action, r.EffectName, err.Error())
		return err
	}

	log.Printf("Successfully performed %s on particle effect %s", r.Action, r.EffectName)
	return nil
}

// DoDragon compiles and sends an action for the dragon effect
func DoDragon(r model.InboundDragonRequest) error {
	action := model.Action(r.Action)
	floatingMsg := ""
	if action == model.StartEffectAction {
		if r.Static {
			floatingMsg = " (not floating up)"
		} else {
			floatingMsg = " (floating up)"
		}
	}
	log.Printf("Attempting to perform %s%s on the dragon", r.Action, floatingMsg)

	request := model.DragonRequest{
		Action:  action,
		PointID: 0,
		Static:  &r.Static,
	}

	body, err := json.Marshal(request)
	if err != nil {
		log.Printf("Failed to marshal dragon request: %s", err.Error())
		return err
	}

	err = client.Do(http.MethodPost, endpointDragon, body)
	if err != nil {
		log.Printf("Failed to perform %s on the dragon: %s", r.Action, err.Error())
		return err
	}

	log.Printf("Successfully performed %s%s on the dragon", r.Action, floatingMsg)
	return nil
}
