const BASE_URL = `${window.location.origin}`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;
const SERVERS_ENDPOINT = `${BASE_URL}/servers`;
const SELECTSTAGE_ENDPOINT = `${BASE_URL}/selectstage`;
const EFFECTS_ENDPOINT = `${BASE_URL}/effects`;
const BOSSBAR_ENDPOINT = `${BASE_URL}/bossbar`;

const CLOCK_ENDPOINT = `${BASE_URL}/clock`;

// ================ EFFECTS ================

var startTime;

doEffect = async (effectType, id, action) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${EFFECTS_ENDPOINT}/run/${effectType}/${id}/${action}`);
    request.addEventListener('load', () => {
        updateResponseTime(Date.now() - startTime);
    });

    startTime = Date.now();
    request.send();
};

doStopAll = (button, stopEffects, detachClocks, specificTypeOnly) => {
    if (button && receiveUIUpdates) {
        button.disabled = true;
        button.classList.add("disabled");
    }

    const body = {
        "stopEffects": stopEffects,
        "detachClocks": detachClocks,
        "specificTypeOnly": specificTypeOnly
    };

    const request = new XMLHttpRequest();
    request.open("POST", `${EFFECTS_ENDPOINT}/stopall`);
    request.addEventListener('load', () => {
        updateResponseTime(Date.now() - startTime);
    });

    startTime = Date.now();
    request.send(JSON.stringify(body));
};

doClearBossbar = async () => {
    const request = new XMLHttpRequest();
    request.open("POST", `${BOSSBAR_ENDPOINT}/clear`);

    request.send();
};

// ================ CLOCK ================

doRestartClock = async (callback) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${CLOCK_ENDPOINT}/restart`);
    request.addEventListener('load', callback);

    request.send();
};

doSetClockSpeed = async (bpm, noteLength) => {
    // this flag is checked when retrieving a clock speed update through the websocket
    // and if set to true, we ignore the update as we already set the speed on the UI
    isClockSpeedInitiator = true;

    const body = {
        "bpm": bpm,
        "noteLength": noteLength
    };

    const request = new XMLHttpRequest();
    request.open("POST", `${CLOCK_ENDPOINT}/speed`);
    request.send(JSON.stringify(body));
};

doClockSubscription = async (effectType, id, action, isRunning, offBeat) => {
    const body = {
        "presetId": id,
        "effectType": effectType,
        "isRunning": isRunning,
        "offBeat": offBeat
    };

    const request = new XMLHttpRequest();
    request.open("PUT", `${CLOCK_ENDPOINT}/${action}`);
    request.send(JSON.stringify(body));
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
