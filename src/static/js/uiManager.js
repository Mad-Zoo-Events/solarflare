const STATUS_UPDATE_INTERVAL = 30000;

var counters = new Map();

init = () => {
    setInterval(doStatusUpdateRequest, STATUS_UPDATE_INTERVAL);
}

addToLog = (action, displayName, errMsg) => {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    const msg = `${action} <b>${displayName}</b> ${errMsg ? "failed: " + errMsg : "succeeded"}`;
    const logLine = `<span class="log-message">${timestamp} | <span class="${errMsg ? "failure" : "success"}">${msg}</span></span>`

    logWindow.innerHTML = logLine + logWindow.innerHTML;
}

updateStatus = (serverCount) => {
    document.getElementById('status-server-count').innerHTML = serverCount;
}

counter = async (id, action) => {
    const startButton = document.getElementById(`start-${id}`);
    var seconds = 0;

    if (action === "START") {
        startButton.disabled = true;
        startButton.classList.add("disabled");
        counters[id] = setInterval(() => {
            seconds++;
            startButton.innerHTML = seconds;
        }, 1000);
    } else if (action === "STOP" && counters[id]) {
        clearInterval(counters[id]);
        startButton.disabled = false;
        startButton.classList.remove("disabled");
        startButton.innerHTML = "start";
    }
}