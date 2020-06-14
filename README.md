# Candyshop
Your Friendly Neighborhood Eyecandy Distribution System&trade;

## What is this?
Candyshop is a Minecraft visual effect management system that works in combination with [the Eyecandy plugin](https://github.com/SorenNeedsCoffee/eyecandy).

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

### Presets

Presets represent a compilation of effects of the same type to be controlled at the same time. For instance you could display hearts in a specific location and shape while also turning on the rain in a different shape.

Each interaction with the system requires a preset to be created upfront. Upon creation, the service generates a UUID to identify the preset. The presets can then be controlled from the control panel or through web request.

Effects in a preset have to be of the same type (either particle effect, dragon effect, or laser in the future) and the same action (start, stop, trigger, restart) is executed on all effects at the same time.

### Control Panel

The control panel is the browser-based user interface which lets you control effects, manage presets and monitor the network.

*Work in Progress.*

## System Architecture

The system consists of three components:

- This Go service (preset management, orchestration and request distribution)
- Control Panel (website hosted by the Go service)
- The Eyecandy Plugin (running on Minecraft servers)

The basic workflow is as follows:
1. User creates presets in the Control Panel
2. user triggers action on a preset by ID
3. Go service then loads the corresponding information
4. Go service compiles request and concurrently sends it to all registered Eyecandy instances

### Registration of Servers

This system can be used to cater a large number of Minecraft server instances at the same time. Thus, each instance needs to have the Eyecandy plugin installed and the Candyshop service must know the address of each instance.

To automate this process, each Eyecandy plugin will register itself at the Go service when it starts up by sending it's network address. The Go service maintains a list of registered servers and distributes traffic to all servers this way.

*To be implemented*

## Request Models

### Trigger an action on a preset
```
POST https://visuals.madzoo.events/presets/{preset_id}/{action}
```

**Parameters:**

| Parameter   | Description                             |
| ----------- | --------------------------------------- |
| `preset_id` | The UUID of the preset to be controlled |
| `action`    | the action to perform on the preset     |

**Actions allowed on *particle effect* presets:**
- `trigger`
- `start`
- `stop`

**Actions allowed on *dragon effect* presets:**
- `start`
- `restart`
- `stop`