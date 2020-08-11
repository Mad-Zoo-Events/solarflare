package manager

import (
	"time"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
)

const millisPerSecond = 60000

var tickTock *clock
var clk *time.Ticker

type clock struct {
	interval   time.Duration
	bpm        float64
	multiplier float64

	nextAction model.EffectAction

	notify    chan bool
	syncStart bool
	syncStop  bool

	particleEffects  map[string]model.ParticleEffectPreset
	dragonEffects    map[string]model.DragonEffectPreset
	timeshiftEffects map[string]model.TimeshiftEffectPreset
	potionEffects    map[string]model.PotionEffectPreset
	laserEffects     map[string]model.LaserEffectPreset
}

func init() {
	tickTock = &clock{
		nextAction: model.StartEffectAction,

		particleEffects:  make(map[string]model.ParticleEffectPreset),
		dragonEffects:    make(map[string]model.DragonEffectPreset),
		timeshiftEffects: make(map[string]model.TimeshiftEffectPreset),
		potionEffects:    make(map[string]model.PotionEffectPreset),
		laserEffects:     make(map[string]model.LaserEffectPreset),

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
}

// GetClockSpeed gets the current clock speed
func GetClockSpeed() (bpm float64, multiplier float64) {
	return tickTock.bpm, tickTock.multiplier
}

// SubscribeEffectToClock registers an effect to the clock
func SubscribeEffectToClock(id string, effectType model.EffectType, isRunning bool) error {
	p, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	if isRunning {
		waitForStart()
	} else {
		waitForStop()
	}

	switch effectType {
	case model.ParticleEffectType:
		tickTock.particleEffects[id] = p.(model.ParticleEffectPreset)
	case model.DragonEffectType:
		tickTock.dragonEffects[id] = p.(model.DragonEffectPreset)
	case model.TimeshiftEffectType:
		tickTock.timeshiftEffects[id] = p.(model.TimeshiftEffectPreset)
	case model.PotionEffectType:
		tickTock.potionEffects[id] = p.(model.PotionEffectPreset)
	case model.LaserEffectType:
		tickTock.laserEffects[id] = p.(model.LaserEffectPreset)
	}

	sendClockUpdate(id, model.SubscribeClockAction)

	return nil
}

// UnsubscribeEffectFromClock unsubscribes an effect from the clock
func UnsubscribeEffectFromClock(id string, effectType model.EffectType, triggeredByStopAll bool) {
	if !triggeredByStopAll {
		waitForStop()
	}

	if id == "all" {
		tickTock.particleEffects = make(map[string]model.ParticleEffectPreset)
		tickTock.dragonEffects = make(map[string]model.DragonEffectPreset)
		tickTock.timeshiftEffects = make(map[string]model.TimeshiftEffectPreset)
		tickTock.potionEffects = make(map[string]model.PotionEffectPreset)
		tickTock.laserEffects = make(map[string]model.LaserEffectPreset)
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

	sendClockUpdate(id, model.UnsubscribeClockAction)
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
		go RunParticleEffect(e, c.nextAction, false)
	}
	for _, e := range c.dragonEffects {
		go RunDragonEffect(e, c.nextAction, false)
	}
	for _, e := range c.timeshiftEffects {
		go RunTimeshiftEffect(e, c.nextAction, false)
	}
	for _, e := range c.potionEffects {
		go RunPotionEffect(e, c.nextAction, false)
	}
	for _, e := range c.laserEffects {
		go RunLaserEffect(e, c.nextAction, false)
	}

	c.nextAction = model.StopEffectAction

	if c.syncStart {
		c.notify <- true
	}
}

func (c *clock) tock() {
	for _, e := range c.particleEffects {
		go StopEffect(e.ID, false)
	}
	for _, e := range c.dragonEffects {
		go StopEffect(e.ID, false)
	}
	for _, e := range c.timeshiftEffects {
		go StopEffect(e.ID, false)
	}
	for _, e := range c.potionEffects {
		go StopEffect(e.ID, false)
	}
	for _, e := range c.laserEffects {
		go StopEffect(e.ID, false)
	}

	c.nextAction = model.StartEffectAction

	if c.syncStop {
		c.notify <- true
	}
}

func sendClockUpdate(id string, action model.ClockAction) {
	update := model.UIUpdate{
		ClockUpdate: &model.ClockUpdate{
			ID:     id,
			Action: action,
		},
	}

	SendUIUpdate(update)
}
