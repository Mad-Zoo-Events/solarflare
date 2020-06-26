const BASE_URL = `${window.location.origin}`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;
const EFFECTS_ENDPOINT = `${BASE_URL}/effects`;
const PRESETS_ENDPOINT = `${BASE_URL}/presets`;

const CLOCK_ENDPOINT = `${BASE_URL}/clock`;

const CP_ENDPOINT = `${BASE_URL}/controlpanel`;
const CP_PRESETS_ENDPOINT = `${CP_ENDPOINT}/presets`;

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
            updateStatus(resp);
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

doSetClockSpeed = async (bpm, multiplier) => {
    const request = new XMLHttpRequest();
    request.open("PUT", `${CLOCK_ENDPOINT}/${bpm}/${multiplier}`);

    request.send();
}

doClockSubscription = async (id, effectType, action) => {
    const method = action === "subscribe" ? "POST" : "DELETE"

    const request = new XMLHttpRequest();
    request.open(method, `${CLOCK_ENDPOINT}/${effectType}/${id}`);

    request.send();
}

navigate = (endpoint) => window.location.href = endpoint;
