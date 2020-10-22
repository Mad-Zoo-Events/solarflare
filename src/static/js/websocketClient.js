var socket;

window.onbeforeunload = function () {
    if (socket) {
        socket.onclose = function () { }; // disable onclose handler first
        socket.close();
    }
};

openWebsocket = async () => {
    if (location.hostname === "localhost") {
        socket = new WebSocket(`ws://localhost:5000/socket`);
    } else {
        socket = new WebSocket(`wss://${window.location.host}/socket`);
    }

    socket.onopen = () => {
        document.getElementById("status-connection-status").innerHTML = "Connected";
        document.getElementById("status-connection-status").classList.replace("orange", "green");
    };
    socket.onclose = (event) => {
        logInfoMessage(`connection closed ${event.wasClean ? "" : "unexpectedly "}(${event.code}: ${event.reason})`);
        setTimeout(openWebsocket, 1000);
    };
    socket.onerror = () => {
        logInfoMessage(`connection closed due to an error`);
        document.getElementById("status-connection-status").innerHTML = "Connection lost...";
        document.getElementById("status-connection-status").classList.replace("green", "orange");
    };

    socket.onmessage = (e) => handleMessage(JSON.parse(e.data));
};

handleMessage = (data) => {
    const {
        effectUpdate,
        clockUpdate,
        clockSpeedUpdate,
        statusUpdate,
        stageUpdate,
        commandUpdate
    } = data;

    if (effectUpdate) {
        const { id, effectType, displayName, action, errorMessage, stopAll } = effectUpdate;

        if (stopAll) {
            const { stopEffects, detachClocks, specificTypeOnly } = stopAll;

            if (detachClocks) {
                detachClockAll(specificTypeOnly);
            }

            if (stopEffects) {
                stopEffectsAll(specificTypeOnly);
            }

            const buttons = document.getElementsByClassName("stop-all-button");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].disabled = false;
                buttons[i].classList.remove("disabled");
            }

            logEffectMessage("=>", "STOP ALL");
        } else if (id === "bossbar") {
            const parts = displayName.split("௵");
            document.getElementById("bossbar-text").value = parts[0];
            document.getElementById("bossbar-color").value = parts[1];
        } else {
            if (!errorMessage && action !== "trigger") {
                if (action === "start") {
                    startEffect(id, effectType);
                } else if (action === "stop") {
                    stopEffect(id);
                }
            }

            logEffectMessage(action, displayName, errorMessage);
        }
    };

    if (clockUpdate) {
        const { id, effectType, isOffBeat, action } = clockUpdate;

        switch (action) {
            case "subscribe":
                attachClockUI(id, effectType, isOffBeat);
                break;
            case "unsubscribe":
                detachClockUI(id, isOffBeat);
                break;
        }
    }

    if (clockSpeedUpdate) {
        // if the request to change the clock speed came from this host
        // then no UI update is needed, so reset the flag and return
        if (isClockSpeedInitiator) {
            isClockSpeedInitiator = false;
            return;
        }

        const { clockSpeedBpm, clockSpeedMultiplier } = clockSpeedUpdate;

        clockInterval = 60000 / clockSpeedBpm * clockSpeedMultiplier;
        updateClockControls(clockSpeedBpm, clockSpeedMultiplier);
        restartUIClock();
    }

    if (statusUpdate) {
        const { activeServerIDs } = statusUpdate;
        const activeServerCount = activeServerIDs.length;

        const checkboxes = document.getElementsByClassName("server-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i];
            if (activeServerIDs.includes(checkbox.name)) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        }

        document.getElementById("status-server-count").innerHTML = activeServerCount;
        logInfoMessage(`Server list updated - ${activeServerCount} ${activeServerCount === 1 ? "instance is" : "instances are"} now connected`);
    }

    if (stageUpdate) {
        window.location.reload();
    }

    if (commandUpdate) {
        const { command, errorMessage } = commandUpdate;

        logEffectMessage("run command", command, errorMessage);
    }
};
