package manager

import (
	"sync"
	"time"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
)

var tickTock *clock
var wg sync.WaitGroup

type clock struct {
	interval   time.Duration
	bpm        int
	multiplier float64

	action model.Action
	stop   bool
	sync   bool

	particleEffects  map[string]model.ParticleEffectPreset
	dragonEffects    map[string]model.DragonEffectPreset
	timeshiftEffects map[string]model.TimeshiftEffectPreset
	potionEffects    map[string]model.PotionEffectPreset
}

// StartClock starts a new clock with the specified millisecond interval
func StartClock(bpm int, multiplier float64) {
	tickTock = &clock{
		action: model.StartEffectAction,
		stop:   false,

		particleEffects:  make(map[string]model.ParticleEffectPreset),
		dragonEffects:    make(map[string]model.DragonEffectPreset),
		timeshiftEffects: make(map[string]model.TimeshiftEffectPreset),
		potionEffects:    make(map[string]model.PotionEffectPreset),
	}

	SetClockSpeed(bpm, multiplier)

	go tickTock.run()
}

// StopClock stops the clock
func StopClock() {
	tickTock.stop = true
}

// RestartClock stops the running clock and starts a new one
func RestartClock() {
	// create a new clock
	newClock := *tickTock
	newClock.action = model.StartEffectAction

	// stop the old one
	tickTock.stop = true

	// start the new one
	go newClock.run()

	// wait for the old one to stop
	time.Sleep(tickTock.interval)

	// and set the global clock to the new one
	tickTock = &newClock
}

// SetClockSpeed sets a new speed for the clock
func SetClockSpeed(bpm int, multiplier float64) {
	tickTock.bpm = bpm
	tickTock.multiplier = multiplier

	millis := 60000 / float64(bpm) * multiplier
	tickTock.interval = time.Duration(millis * 1000000)
}

// GetClockSpeed gets the current clock speed
func GetClockSpeed() (bpm int, multiplier float64) {
	return tickTock.bpm, tickTock.multiplier
}

// ClockSubscribeEffect registers an effect to the clock
func ClockSubscribeEffect(id string, effectType model.EffectType) error {
	p, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	// Wait until the effects are stopped
	if tickTock.action == model.StopEffectAction {
		time.Sleep(tickTock.interval)
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

// ClockUnsubscribeEffect unsubscribes an effect from the clock
func ClockUnsubscribeEffect(id string, effectType model.EffectType) {
	// Wait until the effects are stopped
	if tickTock.action == model.StopEffectAction {
		time.Sleep(tickTock.interval)
	}

	if id == "all" {
		tickTock.particleEffects = make(map[string]model.ParticleEffectPreset)
		tickTock.dragonEffects = make(map[string]model.DragonEffectPreset)
		tickTock.timeshiftEffects = make(map[string]model.TimeshiftEffectPreset)
		tickTock.potionEffects = make(map[string]model.PotionEffectPreset)
		return
	}

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
}

// ClockWaitForNextStart waits for the next "start" run on the clock
func ClockWaitForNextStart() {
	wg.Add(1)
	tickTock.sync = true
	wg.Wait()
	tickTock.sync = false
	return
}

func (c *clock) run() {
	for {
		if c.stop {
			return
		}

		if c.action == model.StartEffectAction {
			go c.tick()
			if c.sync {
				wg.Done()
			}
		} else {
			go c.tock()
		}

		time.Sleep(c.interval)
	}
}

func (c *clock) tick() {
	for _, e := range c.particleEffects {
		go RunParticleEffect(e, c.action)
	}
	for _, e := range c.dragonEffects {
		go RunDragonEffect(e, c.action)
	}
	for _, e := range c.timeshiftEffects {
		go RunTimeshiftEffect(e, c.action)
	}
	for _, e := range c.potionEffects {
		go RunPotionEffect(e, c.action)
	}

	c.action = model.StopEffectAction
}

func (c *clock) tock() {
	for _, e := range c.particleEffects {
		go StopEffect(e.ID)
	}
	for _, e := range c.dragonEffects {
		go StopEffect(e.ID)
	}
	for _, e := range c.timeshiftEffects {
		go StopEffect(e.ID)
	}
	for _, e := range c.potionEffects {
		go StopEffect(e.ID)
	}

	c.action = model.StartEffectAction
}
