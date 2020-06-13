const BASE_URL = `${window.location.origin}`;
const PARTICLE_ENDPOINT = `${BASE_URL}/effects/particle`;
const DRAGON_ENDPOINT = `${BASE_URL}/effects/dragon`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;

var counters = new Map();

init = () => {
    setInterval(doStatusUpdate, 30000);
}

// ================ HTTP REQUESTS ================ //

doStatusUpdate = async () => {
    const request = new XMLHttpRequest();
    request.open("GET", STATUS_ENDPOINT);
    request.addEventListener('load', () => {
        if (request.status === 200) {
            const resp = JSON.parse(request.responseText);
            updateStatus(resp.RegisteredServerCount);
        } else {
            addToLog(">>>", "Retrieve status update", request.responseText);
        }
    });
    request.send();
}

sendParticleEffect = async (effectName, effectDisplayName, action) => {
    const requestBody = {
        "EffectName": effectName,
        "Action": action
    };

    doEffectRequest(
        PARTICLE_ENDPOINT,
        JSON.stringify(requestBody),
        (errorMsg) => addToLog(action, effectDisplayName, errorMsg)
    );

    counter(effectName, action);
}

sendDragonEffect = async (effectDisplayName, action) => {
    const floatUp = document.getElementById("dragon-float-up").checked;
    const requestBody = {
        "Action": action,
        "Static": !floatUp
    };

    doEffectRequest(
        DRAGON_ENDPOINT,
        JSON.stringify(requestBody),
        (errorMsg) => addToLog(action, effectDisplayName, errorMsg)
    );

    counter("dragon", action);
}

doEffectRequest = async (endpoint, payload, callback) => {
    const request = new XMLHttpRequest();
    request.open("POST", endpoint);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 300) {
            callback();
        } else {
            callback(`${request.responseText}`);
        }
    });
    request.send(payload);
}

// ================ UI UPDATES ================ //

addToLog = (action, effectDispalyName, errMsg) => {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    const msg = `${action} <b>${effectDispalyName}</b> ${errMsg ? "failed: " + errMsg : "succeeded"}`;
    const logLine = `<span class="log-message">${timestamp} | <span class="${errMsg ? "failure" : "success"}">${msg}</span></span>`

    logWindow.innerHTML = logLine + logWindow.innerHTML;
}

updateStatus = (serverCount) => {
    document.getElementById('status-server-count').innerHTML = serverCount;
}

counter = async (name, action) => {
    const startButton = document.getElementById(`start-${name}`);
    var seconds = 0;

    if (action === "START") {
        startButton.disabled = true;
        startButton.classList.add("disabled");
        counters[name] = setInterval(() => {
            seconds++;
            startButton.innerHTML = seconds;
        }, 1000);
    } else if (action === "STOP" && counters[name]) {
        clearInterval(counters[name]);
        startButton.disabled = false;
        startButton.classList.remove("disabled");
        startButton.innerHTML = "start";
    }
}
