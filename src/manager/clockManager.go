package manager

import (
	"time"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
)

const millisPerSecond = 60000

var tickTock *clock

type clockEffect struct {
	id         string
	preset     interface{}
	effectType model.EffectType
	isOffBeat  bool

	firstRun bool
	detach   bool
}

type clock struct {
	interval   time.Duration
	bpm        float64
	multiplier float64
	ticker     *time.Ticker

	doSync   bool
	syncChan chan bool
	stopChan chan bool

	effects map[string]*clockEffect
}

func init() {
	tickTock = &clock{
		syncChan: make(chan bool),
		stopChan: make(chan bool),
		effects:  make(map[string]*clockEffect),
	}
	tickTock.setSpeed(128, 1)

	tickTock.start()
}

// RestartClock resets the ticker to start running again after one full cycle
func RestartClock() {
	tickTock.stop()
	tickTock.start()
}

// SetClockSpeed sets a new speed for the clock
func SetClockSpeed(bpm float64, multiplier float64) {
	tickTock.setSpeed(bpm, multiplier)

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

	tickTock.effects[id] = &clockEffect{
		id:         id,
		preset:     p,
		effectType: effectType,
		isOffBeat:  isOffBeat,

		firstRun: true,
	}

	sendClockUpdate(id, effectType, model.SubscribeClockAction, isOffBeat)

	return nil
}

// UnsubscribeEffectFromClock unsubscribes an effect from the clock
func UnsubscribeEffectFromClock(id string, effectType model.EffectType, isOffBeat bool) {
	tickTock.effects[id].detach = true

	sendClockUpdate(id, effectType, model.UnsubscribeClockAction, isOffBeat)
}

// UnsubscribeAllFromClock unsubscribes all effects (or all of a specific type) from the clock
func UnsubscribeAllFromClock(effectType *model.EffectType) {
	if effectType == nil {
		for _, e := range tickTock.effects {
			e.detach = true
		}

		return
	}

	for _, e := range tickTock.effects {
		if e.effectType == *effectType {
			e.detach = true
		}
	}
}

// ClockSync returns after waiting for the next on-beat run on the clock
func ClockSync() {
	tickTock.doSync = true
	<-tickTock.syncChan
}

func sendClockUpdate(id string, effectType model.EffectType, action model.ClockAction, isOffBeat bool) {
	update := model.UIUpdate{
		ClockUpdate: &model.ClockUpdate{
			ID:         id,
			EffectType: effectType,
			Action:     action,
			IsOffBeat:  isOffBeat,
		},
	}

	SendUIUpdate(update)
}

func (c *clock) setSpeed(bpm float64, multiplier float64) {
	c.bpm = bpm
	c.multiplier = multiplier

	millis := millisPerSecond / float64(bpm) * multiplier
	c.interval = time.Duration(millis) * time.Millisecond
	c.ticker = time.NewTicker(c.interval)
}

func (c *clock) start() {
	doTick := true

	go func() {
		for {
			select {
			case <-c.ticker.C:
				go c.doEffects(doTick)

				if doTick && c.doSync {
					c.syncChan <- true
					c.doSync = false
				}

				doTick = !doTick
			case <-c.stopChan:
				return
			}
		}
	}()
}

func (c *clock) stop() {
	c.ticker.Stop()
	c.stopChan <- true
}

func (c *clock) doEffects(offBeatCycle bool) {
	for _, e := range c.effects {
		if (e.isOffBeat && offBeatCycle) || (!e.isOffBeat && !offBeatCycle) {
			if e.detach {
				delete(tickTock.effects, e.id)
				continue
			}

			switch e.effectType {
			case model.ParticleEffectType:
				go RunParticleEffect(e.preset.(model.ParticleEffectPreset), model.StartEffectAction, false)
			case model.DragonEffectType:
				go RunDragonEffect(e.preset.(model.DragonEffectPreset), model.StartEffectAction, false)
			case model.TimeshiftEffectType:
				go RunTimeshiftEffect(e.preset.(model.TimeshiftEffectPreset), model.StartEffectAction, false)
			case model.PotionEffectType:
				go RunPotionEffect(e.preset.(model.PotionEffectPreset), model.StartEffectAction, false)
			case model.LaserEffectType:
				go RunLaserEffect(e.preset.(model.LaserEffectPreset), model.StartEffectAction, false)
			case model.CommandEffectType:
				go RunCommandEffect(e.preset.(model.CommandEffectPreset), false)
			}
		} else {
			if e.firstRun {
				e.firstRun = false
				continue
			}

			if _, ok := e.preset.(model.CommandEffectPreset); ok {
				continue
			}

			go StopEffect(e.id, false)
		}
	}
}
