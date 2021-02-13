package model

// ================ INTERNAL MODELS ================ //

// Server contains information about an Aurora plugin server
type Server struct {
	ID             string         `json:"id"` //EC2 instance ID
	Name           string         `json:"name"`
	IsActive       bool           `json:"isActive"`
	InstanceStatus InstanceStatus `json:"instanceStatus"`
	PrivateAddress string         `json:"privateAddress"`
	PublicAddress  string         `json:"publicAddress"`
}

// Setting is the model used to communicate settings stored on the database
type Setting struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// EffectType represents the type of visual effect
type EffectType string

const (
	// BossbarEffectType represents the bossbar effect
	BossbarEffectType = EffectType("bossbar")
	// CommandEffectType represents a command effect
	CommandEffectType = EffectType("command")
	// DragonEffectType represents the dragon effect
	DragonEffectType = EffectType("dragon")
	// LaserEffectType represents both the guardian and end laser effect
	LaserEffectType = EffectType("laser")
	// LightningEffectType represents a lightning effect
	LightningEffectType = EffectType("lightning")
	// ParticleEffectType represents a particle effect
	ParticleEffectType = EffectType("particle")
	// PotionEffectType represents the potion effect
	PotionEffectType = EffectType("potion")
	// TimeshiftEffectType represents the timeshift effect
	TimeshiftEffectType = EffectType("timeshift")
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

// ServerAction represents an action to be performed for a server
type ServerAction string

const (
	// EnableServerAction enables a server
	EnableServerAction = ServerAction("enable")
	// DisableServerAction disables a server
	DisableServerAction = ServerAction("disable")
	// StartServerAction starts an instance
	StartServerAction = ServerAction("start")
	// StopServerAction stops an instance
	StopServerAction = ServerAction("stop")
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

// InstanceStatus represents the status of an instance
type InstanceStatus string

const (
	// InstanceStatusRunning instance is running
	InstanceStatusRunning = InstanceStatus("running")
	// InstanceStatusPending instance is pending
	InstanceStatusPending = InstanceStatus("pending")
	// InstanceStatusInitializing instance is initializing
	InstanceStatusInitializing = InstanceStatus("initializing")
	// InstanceStatusStopped instance is stopped
	InstanceStatusStopped = InstanceStatus("stopped")
	// InstanceStatusStopping instance is stopping
	InstanceStatusStopping = InstanceStatus("stopping")
	// InstanceStatusUnknown the instance status is unknown
	InstanceStatusUnknown = InstanceStatus("unknown")
)

// ================ RESPONSE MODELS ================ //

// Error returns an error
type Error struct {
	Code    int64  `json:"code"`
	Message string `json:"message"`
}

// PresetCollection is the response model used to return all presets at once
type PresetCollection struct {
	CommandEffectPresets   []CommandEffectPresetAPI   `json:"commandPresets"`
	DragonEffectPresets    []DragonEffectPreset       `json:"dragonPresets"`
	LaserEffectPresets     []LaserEffectPreset        `json:"laserPresets"`
	LightningEffectPresets []LightningEffectPresetAPI `json:"lightningPresets"`
	ParticleEffectPresets  []ParticleEffectPresetAPI  `json:"particlePresets"`
	PotionEffectPresets    []PotionEffectPreset       `json:"potionPresets"`
	TimeshiftEffectPresets []TimeshiftEffectPreset    `json:"timeshiftPresets"`
}
