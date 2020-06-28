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

	nextAction model.EffectAction

	stop      bool
	syncStart bool
	syncStop  bool

	particleEffects  map[string]model.ParticleEffectPreset
	dragonEffects    map[string]model.DragonEffectPreset
	timeshiftEffects map[string]model.TimeshiftEffectPreset
	potionEffects    map[string]model.PotionEffectPreset
}

func init() {
	tickTock = &clock{
		nextAction: model.StartEffectAction,

		particleEffects:  make(map[string]model.ParticleEffectPreset),
		dragonEffects:    make(map[string]model.DragonEffectPreset),
		timeshiftEffects: make(map[string]model.TimeshiftEffectPreset),
		potionEffects:    make(map[string]model.PotionEffectPreset),
	}

	SetClockSpeed(128, 1)

	go tickTock.run()
}

// RestartClock stops the running clock and starts a new one
func RestartClock() {
	// create a new clock
	newClock := *tickTock
	newClock.nextAction = model.StartEffectAction

	// stop the old one
	tickTock.stop = true

	// start the new one
	go newClock.run()

	// and set the global clock to the new one
	tickTock = &newClock
}

// SetClockSpeed sets a new speed for the clock
func SetClockSpeed(bpm int, multiplier float64) {
	tickTock.bpm = bpm
	tickTock.multiplier = multiplier
	tickTock.interval = time.Minute / time.Duration(bpm) * time.Duration(multiplier)
}

// GetClockSpeed gets the current clock speed
func GetClockSpeed() (bpm int, multiplier float64) {
	return tickTock.bpm, tickTock.multiplier
}

// SubscribeEffectToClock registers an effect to the clock
func SubscribeEffectToClock(id string, effectType model.EffectType) error {
	p, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	waitForStop()

	switch effectType {
	case model.ParticleEffectType:
		tickTock.particleEffects[id] = p.(model.ParticleEffectPreset)
	case model.DragonEffectType:
		tickTock.dragonEffects[id] = p.(model.DragonEffectPreset)
	case model.TimeshiftEffectType:
		tickTock.timeshiftEffects[id] = p.(model.TimeshiftEffectPreset)
	case model.PotionEffectType:
		tickTock.potionEffects[id] = p.(model.PotionEffectPreset)
	}

	return nil
}

// UnsubscribeEffectFromClock unsubscribes an effect from the clock
func UnsubscribeEffectFromClock(id string, effectType model.EffectType) {
	waitForStop()

	if id == "all" {
		tickTock.particleEffects = make(map[string]model.ParticleEffectPreset)
		tickTock.dragonEffects = make(map[string]model.DragonEffectPreset)
		tickTock.timeshiftEffects = make(map[string]model.TimeshiftEffectPreset)
		tickTock.potionEffects = make(map[string]model.PotionEffectPreset)
		return
	}

	switch effectType {
	case model.ParticleEffectType:
		delete(tickTock.particleEffects, id)
	case model.DragonEffectType:
		delete(tickTock.dragonEffects, id)
	case model.TimeshiftEffectType:
		delete(tickTock.timeshiftEffects, id)
	case model.PotionEffectType:
		delete(tickTock.potionEffects, id)
	}
}

// ClockSync returns after waiting for the next "start" run on the clock
func ClockSync() {
	waitForStart()
	return
}

func waitForStart() {
	wg.Add(1)
	tickTock.syncStart = true
	wg.Wait()
	tickTock.syncStart = false
	return
}

func waitForStop() {
	wg.Add(1)
	tickTock.syncStop = true
	wg.Wait()
	tickTock.syncStop = false
	return
}

func (c *clock) run() {
	for {
		if c.stop {
			return
		}

		if c.nextAction == model.StartEffectAction {
			go c.tick()
			if c.syncStart {
				wg.Done()
			}
		} else {
			go c.tock()
			if c.syncStop {
				wg.Done()
			}
		}

		time.Sleep(c.interval)
	}
}

func (c *clock) tick() {
	for _, e := range c.particleEffects {
		go RunParticleEffect(e, c.nextAction)
	}
	for _, e := range c.dragonEffects {
		go RunDragonEffect(e, c.nextAction)
	}
	for _, e := range c.timeshiftEffects {
		go RunTimeshiftEffect(e, c.nextAction)
	}
	for _, e := range c.potionEffects {
		go RunPotionEffect(e, c.nextAction)
	}

	c.nextAction = model.StopEffectAction
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

	c.nextAction = model.StartEffectAction
}
