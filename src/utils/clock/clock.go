package clock

import (
	"time"

	"github.com/eynorey/solarflare/src/utils"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
)

var tickTock *clock

type clock struct {
	interval time.Duration
	action   model.Action
	stop     bool

	particleEffects  map[string]model.ParticleEffectPreset
	dragonEffects    map[string]model.DragonEffectPreset
	timeshiftEffects map[string]model.TimeshiftEffectPreset
	potionEffects    map[string]model.PotionEffectPreset
}

// Start starts a new clock with the specified millisecond interval
func Start(bpm int, multiplier float64) {
	tickTock = &clock{
		action: model.StartEffectAction,
		stop:   false,

		particleEffects:  make(map[string]model.ParticleEffectPreset),
		dragonEffects:    make(map[string]model.DragonEffectPreset),
		timeshiftEffects: make(map[string]model.TimeshiftEffectPreset),
		potionEffects:    make(map[string]model.PotionEffectPreset),
	}

	SetSpeed(bpm, multiplier)

	go tickTock.run()
}

// Stop stops the clock
func Stop() {
	tickTock.stop = true
}

// SetSpeed sets a new speed for the clock
func SetSpeed(bpm int, multiplier float64) {
	millis := 60000 / float64(bpm) * multiplier
	tickTock.interval = time.Duration(millis * 1000000)
}

// SubscribeEffect registers an effect to the clock
func SubscribeEffect(id string, effectType model.EffectType) error {
	p, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	switch effectType {
	case model.EffectTypeParticle:
		tickTock.particleEffects[id] = p.(model.ParticleEffectPreset)
	case model.EffectTypeDragon:
		tickTock.dragonEffects[id] = p.(model.DragonEffectPreset)
	case model.EffectTypeTimeshift:
		tickTock.timeshiftEffects[id] = p.(model.TimeshiftEffectPreset)
	case model.EffectTypePotion:
		tickTock.potionEffects[id] = p.(model.PotionEffectPreset)
	}

	return nil
}

// UnsubscribeEffect unsubscribes an effect from the clock
func UnsubscribeEffect(id string, effectType model.EffectType) error {
	switch effectType {
	case model.EffectTypeParticle:
		delete(tickTock.particleEffects, id)
	case model.EffectTypeDragon:
		delete(tickTock.dragonEffects, id)
	case model.EffectTypeTimeshift:
		delete(tickTock.timeshiftEffects, id)
	case model.EffectTypePotion:
		delete(tickTock.potionEffects, id)
	}

	return nil
}

func (c *clock) run() {
	for {
		if c.stop {
			return
		}

		if c.action == model.StartEffectAction {
			go c.tick()
		} else {
			go c.tock()
		}

		time.Sleep(c.interval)
	}
}

func (c *clock) tick() {
	for _, e := range c.particleEffects {
		go manager.RunParticleEffect(e, c.action)
	}
	for _, e := range c.dragonEffects {
		go manager.RunDragonEffect(e, c.action)
	}
	for _, e := range c.timeshiftEffects {
		go manager.RunTimeshiftEffect(e, c.action)
	}
	for _, e := range c.potionEffects {
		go manager.RunPotionEffect(e, c.action)
	}

	c.action = model.StopEffectAction
}

func (c *clock) tock() {
	for _, e := range c.particleEffects {
		go manager.StopEffect(e.ID)
	}
	for _, e := range c.dragonEffects {
		go manager.StopEffect(e.ID)
	}
	for _, e := range c.timeshiftEffects {
		go manager.StopEffect(e.ID)
	}
	for _, e := range c.potionEffects {
		go manager.StopEffect(e.ID)
	}

	c.action = model.StartEffectAction
}
