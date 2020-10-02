const BASE_URL = `${window.location.origin}`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;
const SERVERS_ENDPOINT = `${BASE_URL}/servers`;
const SELECTSTAGE_ENDPOINT = `${BASE_URL}/selectstage`;
const EFFECTS_ENDPOINT = `${BASE_URL}/effects`;
const BOSSBAR_ENDPOINT = `${BASE_URL}/bossbar`;
const PRESETS_ENDPOINT = `${BASE_URL}/presets`;

const CLOCK_ENDPOINT = `${BASE_URL}/clock`;

const CP_ENDPOINT = `${BASE_URL}/controlpanel`;
const CP_PRESETS_ENDPOINT = `${CP_ENDPOINT}/presets`;

// ================ EFFECTS ================

var startTime;

doEffect = async (effectType, id, action) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${EFFECTS_ENDPOINT}/${effectType}/${id}/${action}`);
    request.addEventListener('load', () => {
        updateResponseTime(Date.now() - startTime);
    });

    startTime = Date.now();
    request.send();
};

doStopAll = (detachClock) => {
    if (detachClock) {
        document.getElementById("stop-all-button").disabled = true;
        document.getElementById("stop-all-button").classList.add("disabled");
        doEffect("particle", "all", "stop");
    } else {
        document.getElementById("stop-all-no-clock-button").disabled = true;
        document.getElementById("stop-all-no-clock-button").classList.add("disabled");
        doEffect("particle", "allnoclock", "stop");
    }
};

doClearBossbar = async () => {
    const request = new XMLHttpRequest();
    request.open("POST", `${BOSSBAR_ENDPOINT}/clear`);

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

doDuplicatePreset = async (id, effectType) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${PRESETS_ENDPOINT}/${effectType}/${id}/duplicate`);
    request.addEventListener('load', () => {
        if (request.status === 201) {
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
    request.addEventListener('load', () => {
        // The service responds exactly when the clock has started an ON cycle, so in order to
        // make up for the network latency we can take the current clock speed, substract the
        // average network latency and wait for that long until we restart the clock on the UI.
        // This way the clock is perfectly in sync with the game from the perspective of the
        // person controlling the visuals

        const delay = (clockInterval && averageLatency) ? clockInterval - averageLatency : 0;

        setTimeout(callback, delay);
    });

    request.send();
};

doSetClockSpeed = async (bpm, multiplier) => {
    // this flag is checked when retrieving a clock speed update through the websocket
    // and if set to true, we ignore the update as we already set the speed on the UI
    var isClockSpeedInitiator = true;

    const request = new XMLHttpRequest();
    request.open("PUT", `${CLOCK_ENDPOINT}/${bpm}/${multiplier}`);

    request.send();
};

doClockSubscription = async (effectType, id, action, callback) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${CLOCK_ENDPOINT}/${action}/${effectType}/${id}`);
    if (callback) {
        request.addEventListener('load', callback);
    }

    request.send();
};

// ================ NETWORK / STATUS ================

doToggleServer = async (id, element) => {
    const action = (element.checked) ? "enable" : "disable";

    const request = new XMLHttpRequest();
    request.open("PATCH", `${SERVERS_ENDPOINT}/${id}/${action}`);
    request.send();
};

doSelectStage = async () => {
    await doStopAll();

    const stage = document.getElementById("stage-selector").value;

    const request = new XMLHttpRequest();
    request.open("POST", `${SELECTSTAGE_ENDPOINT}/${stage}`);
    request.send();
};
