const STATUS_UPDATE_INTERVAL = 30000;

var counters = new Map();

init = () => {
    setInterval(doStatusUpdate, STATUS_UPDATE_INTERVAL);
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
    if (action === "start") {
        startCounter(id);
    } else if (action === "stop") {
        stopCounter(id);
    }
}

startCounter = (id) => {
    const startButton = document.getElementById(`start-${id}`);
    var seconds = 0;

    startButton.disabled = true;
    startButton.classList.add("disabled");
    counters[id] = setInterval(() => {
        seconds++;
        startButton.innerHTML = seconds;
    }, 1000);
}

stopCounter = (id) => {
    if (id === "all") {
        for (const key in counters) {
            clearInterval(counters[key]);
        }

        const buttons = document.getElementsByClassName("start");
        for (let i = 0; i < buttons.length; i++) {
            resetStartButton(buttons[i]);
        }

        return;
    }

    if (!counters[id]) {
        return;
    }

    clearInterval(counters[id]);
    resetStartButton(document.getElementById(`start-${id}`));
}

resetStartButton = async (startButton) => {
    startButton.disabled = false;
    startButton.classList.remove("disabled");
    startButton.innerHTML = "start";
}

confirmDelete = (id, effectType, displayName) => {
    const r = confirm(`WARNING!\nAre you sure you want to delete "${displayName}"?`);
    if (r == true) {
        doDeletePreset(id, effectType);
    }
}

addEffectInput = (formId) => {
    const next = document.getElementsByClassName("effect-box").length;
    const form = document.getElementById(formId);
    const newEffectsHolder = document.getElementsByClassName("effect-box")[0].cloneNode(true);

    const inputs = newEffectsHolder.getElementsByClassName("indexed-input");
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.name = element.name.replace(0, next);
    }

    form.appendChild(newEffectsHolder);
}

removeEffectInput = (index) => {
    document.getElementsByClassName("effect-box")[Number(index)].remove();
}

updateRangeValue = (labelId, value) => {
    document.getElementById(labelId).innerHTML = value;
}
