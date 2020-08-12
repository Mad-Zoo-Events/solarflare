var socket;

openWebsocket = async () => {
    socket = new WebSocket(`wss://${window.location.host}/socket`);
    // socket = new WebSocket(`ws://localhost:5000/socket`);
    socket.onopen = () => {
        document.getElementById("status-connection-status").innerHTML = "Connected";
        document.getElementById("status-connection-status").classList.replace("orange", "green");
    };
    socket.onclose = () => {
        setTimeout(openWebsocket, 1000);
    };
    socket.onerror = () => {
        document.getElementById("status-connection-status").innerHTML = "Connection lost...";
        document.getElementById("status-connection-status").classList.replace("green", "orange");
    };

    socket.onmessage = (e) => handleMessage(JSON.parse(e.data));
};

handleMessage = (data) => {
    const { effectUpdate, clockUpdate } = data;

    if (effectUpdate) {
        const { id, displayName, action, errorMessage } = effectUpdate;

        if (id === "all") {
            detachClockAll();
            activeKeys.clear();
            document.getElementById("stop-all-button").disabled = false;
            document.getElementById("stop-all-button").classList.remove("disabled");

            addToLog("=>", "STOP EVERYTHING");
        } else if (id === "bossbar") {
            const parts = displayName.split("௵");
            document.getElementById("bossbar-text").value = parts[0];
            document.getElementById("bossbar-color").value = parts[1];
        } else {
            addToLog(action, displayName, errorMessage);
        }

        if (!errorMessage) {
            counter(id, action);
        }

        return;
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

        return;
    }
};
