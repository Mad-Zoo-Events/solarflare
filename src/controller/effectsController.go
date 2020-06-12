package controller

import (
	"log"

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

	err := client.SendEffectRequest(endpointParticleEffect, request)
	if err != nil {
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

	err := client.SendEffectRequest(endpointDragon, request)
	if err != nil {
		return err
	}

	log.Printf("Successfully performed %s%s on the dragon", r.Action, floatingMsg)
	return nil
}
