# Solarflare
Your Friendly Neighborhood Eyecandy Distribution System&trade;

## What is this?
Solarflare is a Minecraft visual effect management system that works in combination with [the Eyecandy plugin](https://github.com/SorenNeedsCoffee/eyecandy).

It allows you to create **presets** which can be used to control a range of awesome Minecraft effects in a certain region and shape.

These presets can be executed through a web request (to allow for time-coded visuals through a VST plugin for instance) or on the web UI which is also hosted by this service.

## Core Concepts

### Effects

There are currently two types of effects supported: **Particle Effects** and the infamous **Dying Dragon Effect**. Lasers are on the road map.

#### Particle Effects

Particle effects can be displayed in the Minecraft world in three different ways:

- at a single point
- at a range of points
- in a cuboid with a specified density and optional randomization
- in a complex shape described by a mathematical equation

They can either be triggered once or toggles on and off.

#### Dying Dragon Effect

The dying dragon effect is an amazing purple-laser-beam animation which continuously gets more intense and blinding for as long as it's turned on.

The effect originates from a specified point and can be toggled on and off with the additional option to restart the animation.

#### Timeshift Effect

The timeshift effect lets you control the daylight cycle in the game. You can specify which portion of one Minecraft day to skip ahead or rewind per second. It's a continuous effect that can be turned on and off.

You can trigger as many timeshift effects at the same time as you want. A neat side-effect of this is that the moon's shape reacts to that as it skips along the server time as well. For instance if you skip ahead and rewind with the exact same amount at the same time, the moon just rapidly skips through its cycles without the time of the day actually changing. Add a third time skip on top of that, and you have days flying by with a frenzy moon!

#### Potion Effects

You can apply one or multiple Minecraft potion effects to every player in the world at the same time.

This can be used to turn the lights off with blindness, give players night vision (these two are a good combination), make them glow, become invisible (another combo that looks really cool), move really fast, get nausea... You get the idea.

### Presets

Presets represent a compilation of effects of the same type to be controlled at the same time. For instance you could display hearts in a specific location and shape while also turning on the rain in a different shape.

Each interaction with the system requires a preset to be created upfront. Upon creation, the service generates a UUID to identify the preset. The presets can then be controlled from the control panel or through web request.

Effects in a preset have to be of the same type (either particle effect, dragon effect, or laser in the future) and the same action (start, stop, trigger, restart) is executed on all effects at the same time.

### Control Panel

The control panel is the browser-based user interface which interacts with the Go service.

Here you can execute, create, update and delete presets for the effects described above, monitor the network status and view your click-to-execution delay on the effects.

It also logs a message indicating if the effect you just triggered successfully ran on all servers, or at least on how many of them.

## System Architecture

The system consists of three components:

- This Go service (preset management, orchestration and request distribution)
- Control Panel (website hosted by the Go service)
- The Eyecandy Plugin (running on Minecraft servers)

The basic workflow is as follows:
1. User creates presets in the Control Panel
2. User triggers action on a preset by ID
3. Go service then loads the corresponding information
4. Go service compiles request and concurrently sends it to all registered Eyecandy instances

### Registration of Servers

This system can be used to cater a large number of Minecraft server instances at the same time. Thus, each instance needs to have the Eyecandy plugin installed and Solarflare must know the address of each instance.

To automate this process, each Eyecandy plugin will register itself at the Go service when it starts up by sending it's network address. The Go service maintains a list of registered servers and distributes traffic to all servers this way.

*To be implemented*

## API Endpoints

### Trigger an action on a preset
`POST https://visuals.madzoo.events/effects/{effectType}/{id}/{action}`

There is no payload.

**Parameters:**

| Parameter    | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `effectType` | Type of the effect (see below)                                         |
| `id`         | The UUID of the preset to be controlled (find it on the control panel) |
| `action`     | The action to perform on the preset (see below)                        |

**Effect Types**
- `particle`
- `dragon`
- `timeshift`
- `potion`

**Actions allowed on *particle effect* presets:**
- `trigger`
- `start`
- `stop`

**Actions allowed on *dragon effect* presets:**
- `start`
- `restart`
- `stop`

**Actions allowed on *timeshift effect* presets:**
- `start`
- `stop`

**Actions allowed on *potion effect* presets:**
- `start`
- `stop`

### Manage Presets

It is *highly* recommended to manage presets through the UI only, as there is some conversion happening before they are saved in the database.

If you still wish to do it manually via POST requests, you should know what you are doing and can find the request schemes in the code by yourself.
