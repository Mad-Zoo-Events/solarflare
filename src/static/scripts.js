const BASE_URL = `${window.location.origin}/effects/`;
const ENDPOINT_PARTICLE = "particle";
const ENDPOINT_DRAGON = "dragon";

sendParticleEffect = async (effectName, effectDisplayName, action) => {
    const requestBody = {
        "EffectName": effectName,
        "Action": action
    };

    doRequest(
        ENDPOINT_PARTICLE,
        JSON.stringify(requestBody),
        (errorMsg) => addToLog(action, effectDisplayName, errorMsg)
    );
}

sendDragonEffect = async (effectDisplayName, action) => {
    const requestBody = {
        "Action": action
    };

    doRequest(
        ENDPOINT_DRAGON,
        JSON.stringify(requestBody),
        (errorMsg) => addToLog(action, effectDisplayName, errorMsg)
    );
}

doRequest = async (endpoint, payload, callback) => {
    var request = new XMLHttpRequest();
    request.open("POST", `${BASE_URL}${endpoint}`);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            callback();
        } else {
            callback(`${request.status} ${request.statusText}`);
        }
    });
    request.send(payload);
}

function addToLog(action, effectDispalyName, errMsg) {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    const msg = `${action} <b>${effectDispalyName}</b> ${errMsg ? "failed: " + errMsg : "succeeded"}`;
    const logLine = `<span class="log-message">${timestamp} | <span class="${errMsg ? "failure" : "success"}">${msg}</span></span>`

    logWindow.innerHTML = logLine + logWindow.innerHTML;
}
