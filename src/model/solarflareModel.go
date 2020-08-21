package model

// ================ INTERNAL MODELS ================ //

// ControlPanel holds all data to be rendered on the control panel website
type ControlPanel struct {
	ParticleEffectPresets  []ParticleEffectPreset
	DragonEffectPresets    []DragonEffectPreset
	TimeshiftEffectPresets []TimeshiftEffectPreset
	PotionEffectPresets    []PotionEffectPreset
	LaserEffectPresets     []LaserEffectPreset
	MinecraftColors        []MinecraftColor

	RegisteredServerCount int
	AppVersion            string
}

// Server contains information about an Aurora plugin server
type Server struct {
	ID             string `json:"id"`
	PrivateAddress string `json:"privateAddress"`
	PublicAddress  string `json:"publicAddress"`
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
	// LaserEffectType represents both the guardian and end laser effect
	LaserEffectType = EffectType("laser")
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
	// SubscribeRunningClockAction subscribes an already running visual effect to the clock
	SubscribeRunningClockAction = ClockAction("subscriberunning")
	// UnsubscribeRunningClockAction unsubscribes an already running visual effect from the clock
	UnsubscribeRunningClockAction = ClockAction("unsubscriberunning")
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

// Error returns an error
type Error struct {
	Code    int64  `json:"code"`
	Message string `json:"message"`
}
