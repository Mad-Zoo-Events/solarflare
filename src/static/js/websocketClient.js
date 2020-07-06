var socket;

openWebsocket = () => {
    socket = new WebSocket("ws://localhost:5000/socket");
    socket.onopen = () => {
        document.getElementById("status-connection-status").innerHTML = "Connected";
        document.getElementById("status-connection-status").classList.replace("orange", "green");
    };
    socket.onclose = () => {
        document.getElementById("status-connection-status").innerHTML = "Disconnected... please reload";
        document.getElementById("status-connection-status").classList.replace("green", "orange");
    }

    socket.onmessage = (e) => handleMessage(JSON.parse(e.data));
}

handleMessage = (data) => {
    const { effectUpdate, clockUpdate } = data;

    if (effectUpdate) {
        const { id, displayName, action, errorMessage } = effectUpdate;

        addToLog(action, displayName, errorMessage);

        if (!errorMessage) {
            counter(id, action);
        }
    }

    if (clockUpdate) {
        const { id, action } = clockUpdate;

        if (!activeClocks.has(id)) {
            activeClocks.add(id);
            document.getElementById("clock-" + id).classList.add("clock-attached");
        } else {
            activeClocks.delete(id);
            document.getElementById("clock-" + id).classList.remove("clock-on");
            document.getElementById("clock-" + id).classList.remove("clock-attached");
        }
    }
}