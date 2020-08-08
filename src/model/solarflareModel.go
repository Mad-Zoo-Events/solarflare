package model

// ================ INTERNAL MODELS ================ //

// ControlPanel holds all data to be rendered on the control panel website
type ControlPanel struct {
	ParticleEffectPresets  []ParticleEffectPreset
	DragonEffectPresets    []DragonEffectPreset
	TimeshiftEffectPresets []TimeshiftEffectPreset
	PotionEffectPresets    []PotionEffectPreset
	MinecraftColors        []MinecraftColor

	RegisteredServerCount int
	AppVersion            string
}

// Server contains information about an Aurora plugin server
type Server struct {
	Address string
}

// EffectType represents the type of visual effect
type EffectType string

const (
	// ParticleEffectType represents a particle effect
	ParticleEffectType = EffectType("particle")
	// DragonEffectType represents the dragon effect
	DragonEffectType = EffectType("dragon")
	// TimeshiftEffectType represents the timeshift effect
	TimeshiftEffectType = EffectType("timeshift")
	// PotionEffectType represents the potion effect
	PotionEffectType = EffectType("potion")
	// EndLaserEffectType represents the endlaser effect
	EndLaserEffectType = EffectType("endlaser")
	// TargetedLaserEffectType represents the targeted laser effect
	TargetedLaserEffectType = EffectType("targetedlaser")
	// BossbarEffectType represents the bossbar effect
	BossbarEffectType = EffectType("bossbar")
)

// EffectAction represents the action to be performed on the visual effect (e.g. start, stop, restart...)
type EffectAction string

const (
	// TriggerEffectAction triggers a visual effect
	TriggerEffectAction = EffectAction("trigger")
	// StartEffectAction starts a visual effect
	StartEffectAction = EffectAction("start")
	// RestartEffectAction restarts a visual effect
	RestartEffectAction = EffectAction("restart")
	// StopEffectAction stops a visual effect
	StopEffectAction = EffectAction("stop")
	// SetBossbarAction sets the bossbar text and color
	SetBossbarAction = EffectAction("set")
	// ClearBossbarAction removes the bossbar
	ClearBossbarAction = EffectAction("clear")
)

// ClockAction represents an action to be performed on the clock
type ClockAction string

const (
	// SubscribeClockAction subscribes a visual effect to the clock
	SubscribeClockAction = ClockAction("subscribe")
	// UnsubscribeClockAction unsubscribes a visual effect from the clock
	UnsubscribeClockAction = ClockAction("unsubscribe")
)

// MinecraftColor represents a Minecraft color
type MinecraftColor string

// MinecraftColors is a list of all supported Minecraft colors
var MinecraftColors = []MinecraftColor{
	MinecraftColor("BLUE"),
	MinecraftColor("GREEN"),
	MinecraftColor("PINK"),
	MinecraftColor("PURPLE"),
	MinecraftColor("RED"),
	MinecraftColor("WHITE"),
	MinecraftColor("YELLOW"),
}

// ================ RESPONSE MODELS ================ //

// StatusResponse returns information on the service and the plugin network to the consumer
type StatusResponse struct {
	RegisteredServerCount int     `json:"registeredServerCount"`
	ClockSpeedBPM         float64 `json:"clockSpeedBpm"`
	ClockSpeedMultiplier  float64 `json:"clockSpeedMultiplier"`
}

// Error returns an error
type Error struct {
	Code    int64  `json:"code"`
	Message string `json:"message"`
}
