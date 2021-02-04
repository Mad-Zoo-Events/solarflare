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
	// CommandEffectType represents a command effect
	CommandEffectType = EffectType("command")
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

// ServerAction represents an action to be performed for a server
type ServerAction string

const (
	// EnableServerAction enables a server
	EnableServerAction = ServerAction("enable")
	// DisableServerAction disables a server
	DisableServerAction = ServerAction("disable")
)

// InstanceAction represents an action to be performed on an instance
type InstanceAction string

const (
	// StartInstanceAction starts an instance
	StartInstanceAction = InstanceAction("start")
	// StopInstanceAction stops an instance
	StopInstanceAction = InstanceAction("stop")
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
	ParticleEffectPresets  []ParticleEffectPresetAPI `json:"particlePresets"`
	DragonEffectPresets    []DragonEffectPreset      `json:"dragonPresets"`
	TimeshiftEffectPresets []TimeshiftEffectPreset   `json:"timeshiftPresets"`
	PotionEffectPresets    []PotionEffectPreset      `json:"potionPresets"`
	LaserEffectPresets     []LaserEffectPreset       `json:"laserPresets"`
	CommandEffectPresets   []CommandEffectPresetAPI  `json:"commandPresets"`
}
