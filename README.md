# Solarflare
Your Friendly Neighborhood Visual Effect Distribution System&trade;

## What is this?
Solarflare is a hopelessly over-engineered Minecraft visual effect management system that works in combination with [the Aurora plugin](https://github.com/SorenNeedsCoffee/aurora) and optionally the corresponding [Max For Live device](https://github.com/Mad-Zoo-Events/solarflare-max).

It allows you to create **presets** which can be used to control a range of awesome Minecraft effects in a certain region and shape.

These presets can be executed through a web request (to allow for time-coded visuals through a VST plugin for instance) or on the web UI which is also hosted by this service.

---

- [Solarflare](#solarflare)
	- [What is this?](#what-is-this)
	- [Core Concepts](#core-concepts)
		- [Effects](#effects)
			- [Dying Dragon Effect](#dying-dragon-effect)
			- [Laser Effect](#laser-effect)
			- [Lightning Effect](#lightning-effect)
			- [Particle Effects](#particle-effects)
			- [Potion Effect](#potion-effect)
			- [Timeshift Effect](#timeshift-effect)
		- [Presets](#presets)
		- [Control Panel](#control-panel)
			- [Boss Bar Control](#boss-bar-control)
			- [Run Command](#run-command)
			- [Display Options](#display-options)
			- [Manage Servers](#manage-servers)
			- [Switch Stage](#switch-stage)
			- [Preset Manager](#preset-manager)
		- [Clock](#clock)
	- [System Architecture](#system-architecture)
	- [API Endpoints](#api-endpoints)
		- [Technical](#technical)
			- [Service Health](#service-health)
			- [Application Version](#application-version)
			- [Settings](#settings)
			- [Server Management](#server-management)
		- [Retrieve Presets](#retrieve-presets)
		- [Trigger Actions On Presets](#trigger-actions-on-presets)
		- [Stop All Effects and/or Detach All From The Clock](#stop-all-effects-andor-detach-all-from-the-clock)
		- [Manage Presets](#manage-presets)
		- [Clock Controls](#clock-controls)
			- [Subscribe and Unsubscribe](#subscribe-and-unsubscribe)
			- [Restart](#restart)
			- [Set Speed](#set-speed)
		- [Other](#other)
			- [Execute Command in Minecraft](#execute-command-in-minecraft)
			- [Set The Bossbar (Title)](#set-the-bossbar-title)

---

## Core Concepts

### Effects

#### Dying Dragon Effect

The dying dragon effect is an amazing purple-laser-beam animation which continuously gets more intense and blinding for as long as it's turned on.

The effect originates from a specified point and can be toggled on and off with the additional option to restart the animation.

#### Laser Effect

There are two types of lasers: **Guardian Beam** and **End Crystal Healing Beam**.

Both can be set up to connect two specified points. The Guardian Beams can also be configured to be player-tracking, which means it will track a random player originating from the point specified.

Guardian Beams slowly change colors once while they're active, going from a dark purple to a light green. You can restart the color cycle with the dedicated color-palette button on the guardian laser controls.

#### Lightning Effect

You can create presets to summon lightnings at all points specified. This effect can be triggered once, or toggled on and off.

**Warning:** This effect can quickly become **very** loud in-game, so make sure you warn users to turn off in-game audio ;)

#### Particle Effects

Particle effects can be displayed in the Minecraft world in three different ways:

- at a single point
- at a range of points
- in a cuboid with a specified density and optional randomization
- in a complex shape described by a mathematical equation

They can either be triggered once or toggles on and off.

#### Potion Effect

You can apply one or multiple Minecraft potion effects to every player in the world at the same time.

This can be used to turn the lights off with blindness, give players night vision (these two are a good combination), make them glow, become invisible (another combo that looks really cool), move really fast, get nausea... You get the idea.

#### Timeshift Effect

The timeshift effect lets you control the daylight cycle in the game. You can specify which portion of one Minecraft day to skip ahead or rewind per second. It's a continuous effect that can be turned on and off.

You can trigger as many timeshift effects at the same time as you want. A neat side-effect of this is that the moon's shape reacts to that as it skips along the server time as well. For instance if you skip ahead and rewind with the exact same amount at the same time, the moon just rapidly skips through its cycles without the time of the day actually changing. Add a third time skip on top of that, and you have days flying by with a frenzy moon!

### Presets

Presets represent a compilation of effects of the same type to be controlled at the same time. For instance you could display hearts in a specific location and shape while also turning on the rain in a different shape.

Each preset is identified by a UUID which gets generated upon its creation, and it can then be controlled from the control panel or through web request.

In addition to the effect-specific options, you can define a keyboard shortcut to start/stop it on the control panel, and a set of MIDI options which let you map MIDI keys and channels to certain actions which are to be performed on the preset.
This information can then be used in a client which accepts MIDI input and sends corresponding web requests to the backend, allowing you to map presets to a MIDI keyboard or even time-code a show.

One such client is the [Max For Live Device](https://github.com/Mad-Zoo-Events/solarflare-max) which has been built for Solarflare.

### Control Panel

The control panel is the browser-based user interface which interacts with the Go service.

You can reach it via https://visuals.madzoo.events/controlpanel.

Here you can execute effects, manage presets, run one-off commands, set the in-game boss bar, and more. It also logs a message indicating if the effect you just triggered successfully ran on all servers, or at least on how many of them.

By default, all presets of the same type are grouped together in areas you can freely resize and rearrange on the control panel.

#### Boss Bar Control

The control panel has an input field for text to be displayed on an in-game boss bar.

Next to a color selection of the bar itself, there are also formatting options which you can use to change the appearance of the text. As you start typing, you will see a preview of how the text will look like in-game.

By default, every input you make in the field is applied in the game in real-time. You can choose to uncheck the "Update Live" checkbox, in which case you have to click the "Send" button each time you wish to update it.

#### Run Command

This feature lets you run a single command on all servers currently enabled in the "Server Selection" options (see below)

The command should not contain a leading slash, but Solarflare will be stripping it off in case you forget about that ;)

#### Display Options

In this menu you can select which types of presets you want to be displayed grouped together.

**Enabling** a certain effect type groups all presets of that type together. All remaining presets are "loosely" displayed above the groups and sorted alphabetically by their name.

#### Manage Servers

Solarflare can be used to cater a large number of Minecraft server instances at the same time. Thus, each instance needs to have the Aurora plugin installed and Solarflare must know the address of each instance.
This information is maintained on a dedicated DynamoDB table.

This menu lets you enable and disable servers which Solarflare will then send the effects to, and even start and shut down instances.

#### Switch Stage

Solarflare allows for multiple stages (different Minecraft worlds) to be set up at the same time and lets you select the stage you are going to work on (new stages currently need to be set up manually in the source code)

Selecting a different stage is a server-side - the backend will stop all running effects and reload all presets of that stage from the databases.

This feature can be useful when you already want to work on a new/different stage while another event with another stage is yet to take place.

#### Preset Manager

This button takes you to the preset manager, where you can - well - manage all your presets.

You can also directly reach it via https://visuals.madzoo.events/presetmanager.

### Clock

The clock is a ticker that runs at a set speed in the backend (e.g. at 128 BPM each 1/4 note). It can be used to run specific presets at the set interval.

On the control panel You can either manually set the speed and note length or use the TAP button (or the `+` key) to set BPM based on hearing the music.

For each preset, there are two buttons beneath the other controls: The button on the left subscribes (or unsubscribes) the effect to the clock's ON-beat cycle; the button on the right to the OFF-beat cycle. The attached effect presets will then be toggled following the clock's interval.

## System Architecture

The system consists of three components:

- Go backend (preset management, effect orchestration and request distribution)
- React frontend (user interface for controlling effects and managing presets)
- Aurora Minecraft plugin (running on each instance, executing effects)

The basic workflow is as follows:
1. User creates presets in the control panel
2. User triggers action on a preset by ID
3. Go service loads the corresponding effect instructions
4. Go service compiles request and concurrently sends it to all registered instances
5. Aurora plugins execute instructions on each server
6. Go service sends feedback to all users on the control panel through websocket

## API Endpoints

### Technical

#### Service Health

`GET https://visuals.madzoo.events/health`

Gets the service health (to be implemented)

#### Application Version

`GET https://visuals.madzoo.events/version`

Gets a the service version formatted as the latest build timestamp

#### Settings

`GET https://visuals.madzoo.events/api/settings/{setting}`

`POST https://visuals.madzoo.events/api/settings/{setting}`

Retrieve or store settings on the database

**Parameters:**

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| `setting` | name/key of the setting to store/retrieve |

The payload will be returned as it was stored

**Settings**

- `stage`
  - select a different stage (see [Switch Stage](#switch-stage))
  - available options are currently hardcoded in [the service config](src/config/config.go#L12)
- `layout`
  - better not mess with this
  - seriously, don't try to change this manually
  - layout of the effect categories on the UI
- `displayCategories`
  - another thing you won't need to touch
  - controls which presets types should be grouped based on their effect type

#### Server Management

You can start or stop servers, and enable or disable them to receive effects (see [Manage Servers](#manage-servers))

`PATCH https://visuals.madzoo.events/api/servers/{id}/{action}`

**Parameters:**

| Parameter | Description                       |
| --------- | --------------------------------- |
| `id`      | Internal identifier of the server |
| `action`  | `start\|stop\|enable\|disable`    |


### Retrieve Presets

You can retrieve all presets of a specific type or all presets of all types:

`GET https://visuals.madzoo.events/api/presets/{effectType}`

Returns an array of all presets of the specified type

---

`GET https://visuals.madzoo.events/api/presets/all`

Returns an object containing an array for each preset type

```
{
	"commandPresets": [],
	"dragonPresets": [],
	"laserPresets": [],
	"lightningPresets": [],
	"particlePresets": [],
	"potionPresets": [],
	"timeshiftPresets": []
}
```

### Trigger Actions On Presets

`POST https://visuals.madzoo.events/api/effects/run/{effectType}/{id}/{action}`

There is no payload.

**Parameters:**

| Parameter    | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `effectType` | Type of the effect (see below)                                         |
| `id`         | The UUID of the preset to be controlled (find it on the control panel) |
| `action`     | The action to perform on the preset (see below)                        |

**Effect Types**
- `command`
- `dragon`
- `laser`
- `lightning`
- `particle`
- `potion`
- `timeshift`

**Actions allowed on *command* presets:**
- `trigger`

**Actions allowed on *dragon effect* presets:**
- `start`
- `restart`
- `stop`

**Actions allowed on *laser effect* presets:**
- `trigger` *(only for Guardian Lasers, restarts color cycle)*
- `start`
- `stop`

**Actions allowed on *lightning effect* presets:**
- `trigger`
- `start`
- `stop`

**Actions allowed on *particle effect* presets:**
- `trigger`
- `start`
- `stop`

**Actions allowed on *potion effect* presets:**
- `start`
- `stop`

**Actions allowed on *timeshift effect* presets:**
- `start`
- `stop`

### Stop All Effects and/or Detach All From The Clock

`POST https://visuals.madzoo.events/api/effects/stopall`

**Payload:**

```
{
	"stopEffects": bool,
	"detachClocks": bool,
	"specificTypeOnly": EffectType
}
```

where `EffectType` has to be one of the types listed above.

### Manage Presets

It is *highly* recommended to manage presets through the UI only, as there is some conversion happening before they are saved in the database.

If you still wish to do it manually via POST requests, you should know what you are doing and can find the request schemes in the code by yourself.

### Clock Controls

#### Subscribe and Unsubscribe 

`PUT https://visuals.madzoo.events/api/clock/{action}`

Subscribes an effect to the clock or unsubscribes it.

**Parameters:**

| Parameter | Description              |
| --------- | ------------------------ |
| `action`  | `subscribe\|unsubscribe` |

**Payload:**

```
{
	presetId: string,
	effectType: EffectType,
	isRunning: bool,
	offBeat: bool
}
```

where `EffectType` has to be one of the types listed above, `isRunning` indicates whether the effect is currently running or not, and `offBeat` specifies whether the effect should be attached to the offBeat (or onBeat) cycle of the clock.

#### Restart

`POST https://visuals.madzoo.events/api/clock/restart`

Restarts the clock, use this to sync up visuals on the clock with the music.

#### Set Speed

`POST https://visuals.madzoo.events/api/clock/speed`

Set the clock speed.

**Payload:**

```
{
	bpm: float,
	noteLength: float
}
```

where a `noteLength` of 1 equals a quarter note (so e.g. 0.5 = eight note, 4 = whole note, and so on)

### Other

#### Execute Command in Minecraft

`POST https://visuals.madzoo.events/api/command`

Runs a single command on all connected instances

**Payload:**

```
{
	command: string
}
```

#### Set The Bossbar (Title)

`POST https://visuals.madzoo.events/api/bossbar/{action}`

Sets the in-game boss bar or clears (and hides) it

**Parameters:**

| Parameter | Description  |
| --------- | ------------ |
| `action`  | `set\|clear` |


**Payload:**

```
{
	title: string,
	color: MinecraftColor
}
```

where `MinecraftColor` has to be one of `[BLUE|GREEN|PINK|PURPLE|RED|WHITE|YELLOW]`
