const STATUS_UPDATE_INTERVAL = 10000;

var counters = new Map();
var activeKeys = new Set();
var activeClocks = new Set();

var clock;
var clockLastRun;
var clockTapMillis = new Array();
var clockTapLast;
var clockTapResetTimeout;
var clockTapRestartTimeout;

init = () => {
    doStatusUpdate();
    setInterval(doStatusUpdate, STATUS_UPDATE_INTERVAL);
}

addToLog = (action, displayName, errMsg) => {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    const msg = `${action} <b>${displayName}</b> ${errMsg ? "failed: " + errMsg : "succeeded"}`;
    const logLine = `<span class="log-message">${timestamp} | <span class="${errMsg ? "failure" : "success"}">${msg}</span></span>`

    logWindow.innerHTML = logLine + logWindow.innerHTML;
}

// ================ STATUS UPDATE ================

updateStatus = (response) => {
    const { registeredServerCount, clockSpeedBpm, clockSpeedMultiplier } = response;
    document.getElementById('status-server-count').innerHTML = registeredServerCount;

    setClockControls(clockSpeedBpm, clockSpeedMultiplier);
}

updateResponseTime = (millis) => {
    document.getElementById('status-last-request-time').innerHTML = `${millis} ms`;
}

// ================ COUNTER ================

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
            counters.delete(key);
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
    counters.delete(id);

    resetStartButton(document.getElementById(`start-${id}`));
}

resetStartButton = async (startButton) => {
    startButton.disabled = false;
    startButton.classList.remove("disabled");
    startButton.innerHTML = "start";
}

// ================ PRESET MANAGEMENT ================

confirmDelete = (id, effectType, displayName) => {
    const r = confirm(`WARNING!\nAre you sure you want to delete "${displayName}"?`);
    if (r === true) {
        doDeletePreset(id, effectType);
    }
}

addEffectInput = (formId) => {
    const next = document.getElementsByClassName("effect-box").length;
    const form = document.getElementById(formId);
    const newEffectsHolder = document.getElementsByClassName("effect-box")[0].cloneNode(true);

    // adjust IDs of the new effect's inputs and range labels
    const inputs = newEffectsHolder.getElementsByClassName("indexed-input");
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        if (element.name) {
            element.name = element.name.replace(0, next); // for input fields
        }
        if (element.getAttribute("data-index")) {
            element.setAttribute("data-index", next); // for range inputs
        }
        if (element.id) {
            element.id = element.id.replace(0, next); // for corresponding range input labels
        }
    }

    form.appendChild(newEffectsHolder);
}

removeEffectInput = (element) => {
    if (document.getElementsByClassName("effect-box").length > 1) {
        element.parentNode.parentNode.remove();
    } else {
        alert("Gotta keep at least one effect!\n(what's the point otherwise!?)");
    }
}

updateRangeValue = (labelId, range) => {
    const index = range.getAttribute("data-index");
    console.log(index);
    const id = `${labelId}-${index}`;
    console.log(id);
    document.getElementById(id).innerHTML = range.value;
}

// ================ KEY BINDINGS ================

setKeyBinding = (event, source) => {
    event = event || window.event;
    var charCode = event.which || event.keyCode;
    document.getElementById("key-binding").value = charCode;
    source.value = String.fromCharCode(charCode);
}

checkKeyBinding = (source) => {
    if (source.value === "") {
        document.getElementById("key-binding").value = 0;
    }
}

handleKeypress = (event) => {
    event = event || window.event;
    var charCode = event.which || event.keyCode;

    var buttonsToTrigger;
    if (activeKeys.has(charCode)) {
        buttonsToTrigger = document.getElementsByClassName(`stop key-binding-${charCode}`);
        activeKeys.delete(charCode);
    } else {
        buttonsToTrigger = document.getElementsByClassName(`start key-binding-${charCode}`);
        activeKeys.add(charCode,);
    }

    for (let i = 0; i < buttonsToTrigger.length; i++) {
        buttonsToTrigger[i].click();
    }
}

// ================ CLOCK ================

updateClockBPM = (id, value) => {
    document.getElementById(id).value = Number(value);
}

changeClockSpeed = () => {
    bpm = document.getElementById("clock-bpm-input").value;
    mult = document.getElementById("clock-th-input").value;

    setClockControls(bpm, mult);
    doSetClockSpeed(bpm, mult);
}

setClockControls = (bpm, mult) => {
    document.getElementById("clock-bpm-input").value = bpm;
    document.getElementById("clock-bpm-range").value = bpm;

    const thOptions = document.getElementById("clock-th-input").children;
    for (let i = 0; i < thOptions.length; i++) {
        const element = thOptions[i];
        if (element.value == mult) {
            element.selected = true;
        } else {
            element.selected = false;
        }
    }

    clearInterval(clock);
    millis = 60000 / bpm * mult;
    clock = setInterval(doWhateverTheClockDoes, millis);
}

doWhateverTheClockDoes = (restartNow) => {
    clockLastRun = Date.now();
    const cName = "clock-indicator-on";
    const indicator = document.getElementById("clock-indicator");

    if (restartNow === true || !indicator.classList.contains(cName)) {
        indicator.classList.add(cName);
        activeClocks.forEach((id) => {
            document.getElementById("clock-" + id).classList.add("clock-on");
        })
    } else {
        indicator.classList.remove(cName);
        activeClocks.forEach((id) => {
            document.getElementById("clock-" + id).classList.remove("clock-on");
        })
    }
}

clockTap = () => {
    const th = document.getElementById("clock-th-input").value;
    const now = Date.now();

    if (!clockTapLast) {
        clockTapLast = now;
        return;
    }

    if (clockTapMillis.length >= 4) {
        clockTapMillis.shift();
    }

    clockTapMillis.push(now - clockTapLast);

    clockTapLast = now;

    const millisNew = clockTapMillis.reduce((a, b) => a + b) / clockTapMillis.length;
    const bpmNew = Math.round(60000 / millisNew * th);

    setClockControls(bpmNew, th);
    doSetClockSpeed(bpmNew, th);

    // reset
    clearTimeout(clockTapResetTimeout);
    clockTapResetTimeout = setTimeout(() => {
        clockTapLast = undefined;
        clockTapMillis = [];
    }, millisNew * 2);
}

restartClock = () => {
}

attachClock = (id, effectType) => {
    if (activeClocks.has(id)) {
        activeClocks.delete(id);
        document.getElementById("clock-" + id).classList.remove("clock-on");
        document.getElementById("clock-" + id).classList.remove("clock-attached");

        doClockSubscription(id, effectType, "unsubscribe");
    } else {
        activeClocks.add(id);
        document.getElementById("clock-" + id).classList.add("clock-attached");

        doClockSubscription(id, effectType, "subscribe");
    }
}
