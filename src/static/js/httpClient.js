const BASE_URL = `${window.location.origin}`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;
const EFFECTS_ENDPOINT = `${BASE_URL}/effects`;
const PRESETS_ENDPOINT = `${BASE_URL}/presets`;

const CLOCK_ENDPOINT = `${BASE_URL}/clock`;

const CP_ENDPOINT = `${BASE_URL}/controlpanel`;
const CP_PRESETS_ENDPOINT = `${CP_ENDPOINT}/presets`;

// ================ EFFECTS ================

var startTime;

doEffect = async (effectType, id, displayName, action) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${EFFECTS_ENDPOINT}/${effectType}/${id}/${action}`);
    request.addEventListener('load', () => {
        updateResponseTime(Date.now() - startTime);
    });

    startTime = Date.now();
    request.send();
};

doStopAll = () => {
    doClockSubscription("particle", "all", "stop", () => doEffect("particle", "all", "stop all", "stop"));
    detachClockAll();
};

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
};

// ================ PRESET MANAGEMENT ================

doDeletePreset = async (id, effectType) => {
    const request = new XMLHttpRequest();
    request.open("DELETE", `${PRESETS_ENDPOINT}/${effectType}/${id}`);
    request.addEventListener('load', () => {
        if (request.status === 200) {
            location.reload();
        }
    });

    request.send();
};

// ================ CLOCK ================

doRestartClock = async (callback) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${CLOCK_ENDPOINT}/restart`);
    request.addEventListener('load', callback);

    request.send();
};

doClockSync = async (callback) => {
    const request = new XMLHttpRequest();
    request.open("GET", `${CLOCK_ENDPOINT}/sync`);
    request.addEventListener('load', callback);

    request.send();
};

doSetClockSpeed = async (bpm, multiplier) => {
    const request = new XMLHttpRequest();
    request.open("PUT", `${CLOCK_ENDPOINT}/${bpm}/${multiplier}`);

    request.send();
};

doClockSubscription = async (effectType, id, action) => {
    const method = action === "subscribe" ? "POST" : "DELETE";

    const request = new XMLHttpRequest();
    request.open(method, `${CLOCK_ENDPOINT}/${effectType}/${id}`);

    request.send();
};
