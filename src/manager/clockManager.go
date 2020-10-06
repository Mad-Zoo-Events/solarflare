package manager

import (
	"time"

	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
)

const millisPerSecond = 60000

var (
	tickTock *clock
	clk      *time.Ticker

	doSync   bool
	syncChan chan bool
)

type clockEffect struct {
	id        string
	preset    interface{}
	isOffBeat bool

	firstRun bool
	detach   bool
}

type clock struct {
	interval   time.Duration
	bpm        float64
	multiplier float64

	effects map[string]*clockEffect
}

func init() {
	syncChan = make(chan bool)

	tickTock = &clock{
		effects: make(map[string]*clockEffect),
	}
	setSpeed(128, 1)
	clk = time.NewTicker(tickTock.interval)

	go tickTock.run()
}

// RestartClock resets the ticker to start running again after one full cycle
func RestartClock() {
	clk.Reset(tickTock.interval)
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

	tickTock.effects[id] = &clockEffect{
		id:        id,
		preset:    p,
		isOffBeat: isOffBeat,

		firstRun: true,
	}

	sendClockUpdate(id, model.SubscribeClockAction, isOffBeat)

	return nil
}

// UnsubscribeEffectFromClock unsubscribes an effect from the clock
func UnsubscribeEffectFromClock(id string, effectType model.EffectType, isOffBeat bool) {
	tickTock.effects[id].detach = true

	sendClockUpdate(id, model.UnsubscribeClockAction, isOffBeat)
}

// UnsubscribeAllFromClock unsubscribes all effects from the clock
func UnsubscribeAllFromClock() {
	for _, e := range tickTock.effects {
		e.detach = true
	}
}

// ClockSync returns after waiting for the next on-beat run on the clock
func ClockSync() {
	doSync = true
	<-syncChan
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

func setSpeed(bpm float64, multiplier float64) {
	tickTock.bpm = bpm
	tickTock.multiplier = multiplier

	millis := millisPerSecond / float64(bpm) * multiplier
	tickTock.interval = time.Duration(millis) * time.Millisecond
}

func (c *clock) run() {
	tick := make(chan bool)
	tock := make(chan bool)
	doTick := true

	go func() {
		for range tick {
			c.doEffects(false)
		}
	}()

	go func() {
		for range tock {
			c.doEffects(true)
		}
	}()

	for range clk.C {
		if doTick {
			tick <- true
			if doSync {
				syncChan <- true
			}
			doSync = false
		} else {
			tock <- true
		}
		doTick = !doTick
	}
}

func (c *clock) doEffects(offBeatCycle bool) {
	for _, e := range c.effects {
		if e.detach {
			delete(tickTock.effects, e.id)
			continue
		}

		if (e.isOffBeat && offBeatCycle) || (!e.isOffBeat && !offBeatCycle) {
			switch e.preset.(type) {
			case model.ParticleEffectPreset:
				go RunParticleEffect(e.preset.(model.ParticleEffectPreset), model.StartEffectAction, false)
			case model.DragonEffectPreset:
				go RunDragonEffect(e.preset.(model.DragonEffectPreset), model.StartEffectAction, false)
			case model.TimeshiftEffectPreset:
				go RunTimeshiftEffect(e.preset.(model.TimeshiftEffectPreset), model.StartEffectAction, false)
			case model.PotionEffectPreset:
				go RunPotionEffect(e.preset.(model.PotionEffectPreset), model.StartEffectAction, false)
			case model.LaserEffectPreset:
				go RunLaserEffect(e.preset.(model.LaserEffectPreset), model.StartEffectAction, false)
			}
		} else {
			if e.firstRun {
				e.firstRun = false
				continue
			}

			go StopEffect(e.id, false)
		}
	}
}
