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
    const { effectUpdate, clockUpdate, clockSpeedUpdate, statusUpdate, stageUpdate } = data;

    if (effectUpdate) {
        const { id, displayName, action, errorMessage } = effectUpdate;

        if (id === "all") {
            detachClockAll();
            activeKeys.clear();
            document.getElementById("stop-all-button").disabled = false;
            document.getElementById("stop-all-button").classList.remove("disabled");

            logEffectMessage("=>", "STOP EVERYTHING [W/ DETACH]");
        } else if (id === "allnoclock") {
            activeKeys.clear();
            document.getElementById("stop-all-no-clock-button").disabled = false;
            document.getElementById("stop-all-no-clock-button").classList.remove("disabled");

            logEffectMessage("=>", "STOP EVERYTHING [W/O DETACH]");
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

        if (!activeOnbeatClocks.has(id)) {
            activeOnbeatClocks.add(id);
            document.getElementById("onbeatclock-" + id).classList.add("clock-attached");
        } else {
            activeOnbeatClocks.delete(id);
            document.getElementById("onbeatclock-" + id).classList.remove("clock-on");
            document.getElementById("onbeatclock-" + id).classList.remove("clock-attached");
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
};
