const BASE_URL = `${window.location.origin}`;
const EFFECTS_ENDPOINT = `${BASE_URL}/effects`;
const PRESETS_ENDPOINT = `${BASE_URL}/presets`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;

var startTime;

doEffect = async (effectType, id, displayName, action) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${EFFECTS_ENDPOINT}/${effectType}/${id}/${action}`);
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
            addToLog(action, displayName);
            counter(id, action);
            updateResponseTime(Date.now() - startTime);
        } else {
            addToLog(action, displayName, request.responseText);
        }
    });

    startTime = Date.now();
    request.send();
}

doStatusUpdate = async () => {
    const request = new XMLHttpRequest();
    request.open("GET", STATUS_ENDPOINT);
    request.addEventListener('load', () => {
        if (request.status === 200) {
            const resp = JSON.parse(request.responseText);
            updateStatus(resp.registeredServerCount);
        } else {
            addToLog("[BACKEND]", "Retrieve status update", request.responseText);
        }
    });

    request.send();
}

doDeletePreset = async (id, effectType) => {
    const request = new XMLHttpRequest();
    request.open("DELETE", `${PRESETS_ENDPOINT}/${effectType}/${id}`);
    request.addEventListener('load', () => {
        if (request.status === 200) {
            location.reload();
        }
    });

    request.send();
}
