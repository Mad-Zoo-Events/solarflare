package model

// BossbarRequest is the model used for both inbound and outbound boss bar effects
type BossbarRequest struct {
	Color MinecraftColor `json:"color" form:"bossbar-color"`
	Title string         `json:"title" form:"bossbar-text"`
}
