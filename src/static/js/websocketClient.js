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
    const {updateType} = data;

    switch (updateType) {
        case "effect":
            const {id, action} = data.effectUpdate;
            alert(action, id);
            break;
    
        default:
            break;
    }
}