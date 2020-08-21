var socket;

window.onbeforeunload = function () {
    websocket.onclose = function () { }; // disable onclose handler first
    websocket.close();
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
    socket.onclose = () => {
        document.getElementById("status-connection-status").innerHTML = "Connection lost...";
        document.getElementById("status-connection-status").classList.replace("green", "orange");
        setTimeout(openWebsocket, 1000);
    };
    socket.onerror = () => {
        document.getElementById("status-connection-status").innerHTML = "Connection lost...";
        document.getElementById("status-connection-status").classList.replace("green", "orange");
    };

    socket.onmessage = (e) => handleMessage(JSON.parse(e.data));
};

handleMessage = (data) => {
    const { effectUpdate, clockUpdate, clockSpeedUpdate, statusUpdate } = data;

    if (effectUpdate) {
        const { id, displayName, action, errorMessage } = effectUpdate;

        if (id === "all") {
            detachClockAll();
            activeKeys.clear();
            document.getElementById("stop-all-button").disabled = false;
            document.getElementById("stop-all-button").classList.remove("disabled");

            logEffectMessage("=>", "STOP EVERYTHING");
        } else if (id === "bossbar") {
            const parts = displayName.split("௵");
            document.getElementById("bossbar-text").value = parts[0];
            document.getElementById("bossbar-color").value = parts[1];
        } else {
            logEffectMessage(action, displayName, errorMessage);
        }

        if (!errorMessage) {
            counter(id, action);
        }
    }

    if (clockUpdate) {
        const { id } = clockUpdate;

        if (!activeClocks.has(id)) {
            activeClocks.add(id);
            document.getElementById("clock-" + id).classList.add("clock-attached");
        } else {
            activeClocks.delete(id);
            document.getElementById("clock-" + id).classList.remove("clock-on");
            document.getElementById("clock-" + id).classList.remove("clock-attached");
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
        const { registeredServerCount } = statusUpdate;

        document.getElementById("status-server-count").innerHTML = registeredServerCount;
        logInfoMessage(`Server list reloaded - ${registeredServerCount} ${registeredServerCount === 1 ? "instance is" : "instances are"} now connected`);
    }
};
