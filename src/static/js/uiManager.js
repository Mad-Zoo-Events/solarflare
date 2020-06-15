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

updateResponseTime = (millis) => {
    document.getElementById('status-last-request-time').innerHTML = `${millis} ms`;
}

counter = async (id, action) => {
    const startButton = document.getElementById(`start-${id}`);
    var seconds = 0;

    if (action === "start") {
        startButton.disabled = true;
        startButton.classList.add("disabled");
        counters[id] = setInterval(() => {
            seconds++;
            startButton.innerHTML = seconds;
        }, 1000);
    } else if (action === "stop" && counters[id]) {
        clearInterval(counters[id]);
        startButton.disabled = false;
        startButton.classList.remove("disabled");
        startButton.innerHTML = "start";
    }
}

confirmDelete = (id, effectType, displayName) => {
    const r = confirm(`WARNING!\nAre you sure you want to delete "${displayName}"?`);
    if (r == true) {
        doDeletePreset(id, effectType);
    }
}

addDragonEffectInput = () => {
    const next = document.getElementsByClassName("effect-box").length;
    const form = document.getElementById("dragon-preset-form");
    const newEffectsHolder = document.getElementsByClassName("effect-box")[0].cloneNode(true);

    const inputs = newEffectsHolder.getElementsByClassName("indexed-input");
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.name = element.name.replace(0, next);
    }

    form.appendChild(newEffectsHolder);
}