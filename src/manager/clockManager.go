package manager

import (
	"time"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
)

const millisPerSecond = 60000

var tickTock *clock
var clk *time.Ticker

type clockEffect struct {
	isOffBeat bool
	preset    interface{}
	id        string
}

type clock struct {
	interval   time.Duration
	bpm        float64
	multiplier float64

	nextAction model.EffectAction

	notify    chan bool
	syncStart bool
	syncStop  bool

	particleEffects  map[string]clockEffect
	dragonEffects    map[string]clockEffect
	timeshiftEffects map[string]clockEffect
	potionEffects    map[string]clockEffect
	laserEffects     map[string]clockEffect
}

func init() {
	tickTock = &clock{
		nextAction: model.StartEffectAction,

		particleEffects:  make(map[string]clockEffect),
		dragonEffects:    make(map[string]clockEffect),
		timeshiftEffects: make(map[string]clockEffect),
		potionEffects:    make(map[string]clockEffect),
		laserEffects:     make(map[string]clockEffect),

		notify: make(chan bool),
	}

	setSpeed(128, 1)

	clk = time.NewTicker(tickTock.interval)

	go tickTock.run()
}

// RestartClock stops the running clock and starts a new one
func RestartClock() {
	clk.Stop()
	clk = time.NewTicker(tickTock.interval)
	go tickTock.run()
}

// SetClockSpeed sets a new speed for the clock
func SetClockSpeed(bpm float64, multiplier float64) {
	setSpeed(bpm, multiplier)
	RestartClock()

	update := model.UIUpdate{
		ClockSpeedUpdate: &model.ClockSpeedUpdate{
			ClockSpeedBPM:        bpm,
			ClockSpeedMultiplier: multiplier,
		},
	}

	SendUIUpdate(update)
}

// GetClockSpeed gets the current clock speed
func GetClockSpeed() (bpm float64, multiplier float64) {
	return tickTock.bpm, tickTock.multiplier
}

// SubscribeEffectToClock registers an effect to the clock
func SubscribeEffectToClock(id string, effectType model.EffectType, isOffBeat, isRunning bool) error {
	p, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	if isRunning {
		// waitForStart()
	} else {
		// waitForStop()
	}

	ce := clockEffect{
		isOffBeat: isOffBeat,
		preset:    p,
		id:        id,
	}

	switch effectType {
	case model.ParticleEffectType:
		tickTock.particleEffects[id] = ce
	case model.DragonEffectType:
		tickTock.dragonEffects[id] = ce
	case model.TimeshiftEffectType:
		tickTock.timeshiftEffects[id] = ce
	case model.PotionEffectType:
		tickTock.potionEffects[id] = ce
	case model.LaserEffectType:
		tickTock.laserEffects[id] = ce
	}

	sendClockUpdate(id, model.SubscribeClockAction, isOffBeat)

	return nil
}

// UnsubscribeEffectFromClock unsubscribes an effect from the clock
func UnsubscribeEffectFromClock(id string, effectType model.EffectType, isOffBeat, triggeredByStopAll bool) {
	// if !triggeredByStopAll {
	// 	waitForStop()
	// }

	if id == "all" {
		tickTock.particleEffects = make(map[string]clockEffect)
		tickTock.dragonEffects = make(map[string]clockEffect)
		tickTock.timeshiftEffects = make(map[string]clockEffect)
		tickTock.potionEffects = make(map[string]clockEffect)
		tickTock.laserEffects = make(map[string]clockEffect)
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
	case model.LaserEffectType:
		delete(tickTock.laserEffects, id)
	}

	sendClockUpdate(id, model.UnsubscribeClockAction, isOffBeat)

	StopEffect(id, false)
}

// ClockSync returns after waiting for the next "start" run on the clock
func ClockSync() {
	waitForStart()
}

func setSpeed(bpm float64, multiplier float64) {
	tickTock.bpm = bpm
	tickTock.multiplier = multiplier

	millis := millisPerSecond / float64(bpm) * multiplier
	tickTock.interval = time.Duration(millis) * time.Millisecond
}

func waitForStart() {
	tickTock.syncStart = true
	<-tickTock.notify
	tickTock.syncStart = false
}

func waitForStop() {
	tickTock.syncStop = true
	<-tickTock.notify
	tickTock.syncStop = false
}

func (c *clock) run() {
	for range clk.C {
		switch c.nextAction {
		case model.StartEffectAction:
			go c.tick()
		case model.StopEffectAction:
			go c.tock()
		}
	}
}

func (c *clock) tick() {
	for _, e := range c.particleEffects {
		if e.isOffBeat {
			go StopEffect(e.id, false)
		} else {
			go RunParticleEffect(e.preset.(model.ParticleEffectPreset), model.StartEffectAction, false)
		}
	}
	for _, e := range c.dragonEffects {
		if e.isOffBeat {
			go StopEffect(e.id, false)
		} else {
			go RunDragonEffect(e.preset.(model.DragonEffectPreset), model.StartEffectAction, false)
		}
	}
	for _, e := range c.timeshiftEffects {
		if e.isOffBeat {
			go StopEffect(e.id, false)
		} else {
			go RunTimeshiftEffect(e.preset.(model.TimeshiftEffectPreset), model.StartEffectAction, false)
		}
	}
	for _, e := range c.potionEffects {
		if e.isOffBeat {
			go StopEffect(e.id, false)
		} else {
			go RunPotionEffect(e.preset.(model.PotionEffectPreset), model.StartEffectAction, false)
		}
	}
	for _, e := range c.laserEffects {
		if e.isOffBeat {
			go StopEffect(e.id, false)
		} else {
			go RunLaserEffect(e.preset.(model.LaserEffectPreset), model.StartEffectAction, false)
		}
	}

	c.nextAction = model.StopEffectAction

	if c.syncStart {
		c.notify <- true
	}
}

func (c *clock) tock() {
	for _, e := range c.particleEffects {
		if e.isOffBeat {
			go RunParticleEffect(e.preset.(model.ParticleEffectPreset), model.StartEffectAction, false)
		} else {
			go StopEffect(e.id, false)
		}
	}
	for _, e := range c.dragonEffects {
		if e.isOffBeat {
			go RunDragonEffect(e.preset.(model.DragonEffectPreset), model.StartEffectAction, false)
		} else {
			go StopEffect(e.id, false)
		}
	}
	for _, e := range c.timeshiftEffects {
		if e.isOffBeat {
			go RunTimeshiftEffect(e.preset.(model.TimeshiftEffectPreset), model.StartEffectAction, false)
		} else {
			go StopEffect(e.id, false)
		}
	}
	for _, e := range c.potionEffects {
		if e.isOffBeat {
			go RunPotionEffect(e.preset.(model.PotionEffectPreset), model.StartEffectAction, false)
		} else {
			go StopEffect(e.id, false)
		}
	}
	for _, e := range c.laserEffects {
		if e.isOffBeat {
			go RunLaserEffect(e.preset.(model.LaserEffectPreset), model.StartEffectAction, false)
		} else {
			go StopEffect(e.id, false)
		}
	}

	c.nextAction = model.StartEffectAction

	if c.syncStop {
		c.notify <- true
	}
}

func sendClockUpdate(id string, action model.ClockAction, isOffBeat bool) {
	update := model.UIUpdate{
		ClockUpdate: &model.ClockUpdate{
			ID:        id,
			Action:    action,
			IsOffBeat: isOffBeat,
		},
	}

	SendUIUpdate(update)
}
