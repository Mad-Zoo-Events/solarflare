const CLOCK_SYNC_INTERVAL = 10000;

var counters = new Map();
var activeKeys = new Set();
var activeClocks = new Set();

var clock;
var clockInterval;
var clockTapMillis = new Array();
var clockTapLast;
var clockTapResetTimeout;
var clockTapRestartTimeout;
var isClockSpeedInitiator = false;

var suppressHotkeys = false;
var hoveringOverFormattingPopup = false;

var effectDelayMillis = new Array();
var averageLatency;

init = () => {
    doClockSync(restartUIClock);
    setInterval(() => doClockSync(restartUIClock), CLOCK_SYNC_INTERVAL);
    openWebsocket();
};

navigate = (endpoint) => window.location.href = endpoint;

// ================ OTHER UI UPDATES ================

logEffectMessage = (action, displayName, errMsg) => {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    const msg = `${action} <b>${displayName}</b> ${errMsg ? "failed: " + errMsg : "succeeded"}`;
    const logLine = `<span class="log-message">${timestamp} | <span class="${errMsg ? "failure" : "success"}">${msg}</span></span>`;

    logWindow.innerHTML = logLine + logWindow.innerHTML;
};

logInfoMessage = (msg) => {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    const logLine = `<span class="log-message">${timestamp} | <span class="info-message"><b>[INFO]</b> ${msg}</span></span>`;

    logWindow.innerHTML = logLine + logWindow.innerHTML;
};

toggleFormattingCodePopup = () => {
    if (hoveringOverFormattingPopup) {
        return;
    }
    document.getElementById("bossbar-formatting-popup").classList.toggle("show");
};

addFormatting = (code) => {
    document.getElementById("bossbar-text").value += code;
};

// ================ STATUS UPDATE ================

updateStatus = (response) => {
    const { registeredServerCount, clockSpeedBpm, clockSpeedMultiplier } = response;
    document.getElementById('status-server-count').innerHTML = registeredServerCount;

    clockInterval = 60000 / clockSpeedBpm * clockSpeedMultiplier;
    updateClockControls(clockSpeedBpm, clockSpeedMultiplier);
    restartUIClock();
};

updateResponseTime = (millis) => {
    if (effectDelayMillis.length > 10) {
        effectDelayMillis.shift();
    }
    effectDelayMillis.push(millis);

    averageLatency = (effectDelayMillis.reduce((a, b) => a + b) / effectDelayMillis.length).toFixed(0);

    document.getElementById('status-last-request-time').innerHTML = `${millis} ms`;
    document.getElementById('status-average-request-time').innerHTML = `${averageLatency} ms`;
};

// ================ COUNTER ================

counter = async (id, action) => {
    if (action === "start") {
        startCounter(id);
    } else if (action === "stop") {
        stopCounter(id);
    }
};

startCounter = (id) => {
    const startButton = document.getElementById(`start-${id}`);
    var seconds = 0;

    startButton.disabled = true;
    startButton.classList.add("disabled");
    counters[id] = setInterval(() => {
        seconds++;
        startButton.innerHTML = seconds;
    }, 1000);
};

stopCounter = (id) => {
    if (id === "all") {
        for (const key in counters) {
            clearInterval(counters[key]);
        }

        counters.clear();
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
};

resetStartButton = async (startButton) => {
    startButton.disabled = false;
    startButton.classList.remove("disabled");
    startButton.innerHTML = "start";
};

// ================ PRESET MANAGEMENT ================

confirmDelete = (id, effectType, displayName) => {
    const r = confirm(`WARNING!\nAre you sure you want to delete "${displayName}"?`);
    if (r === true) {
        doDeletePreset(id, effectType);
    }
};

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
};

removeEffectInput = (element) => {
    if (document.getElementsByClassName("effect-box").length > 1) {
        element.parentNode.parentNode.remove();
    } else {
        alert("Gotta keep at least one effect!\n(what's the point otherwise!?)");
    }
};

updateRangeValue = (labelId, range) => {
    const index = range.getAttribute("data-index");
    console.log(index);
    const id = `${labelId}-${index}`;
    console.log(id);
    document.getElementById(id).innerHTML = range.value;
};

handleLaserTypeChecked = (checked) => {
    const flag = document.getElementById("laser-type-flag");
    const targetingCheckbox = document.getElementById("laser-targeting-checkbox");
    if (checked) {
        flag.innerHTML = "End Laser";
        targetingCheckbox.checked = true;
        targetingCheckbox.disabled = true;
    } else {
        flag.innerHTML = "Guardian Laser";
        targetingCheckbox.disabled = false;
    }
};

handleTargetingChecked = (checked) => {
    const flag = document.getElementById("laser-targeting-flag");
    const labels = document.getElementsByClassName("destination-point-label");
    const inputs = document.getElementsByClassName("destination-point-input");
    if (checked) {
        flag.innerHTML = "Connects the two points specified";
        for (let i = 0; i < labels.length; i++) {
            labels[i].style.display = "block";
        }
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
            inputs[i].style.display = "block";
        }
    } else {
        flag.innerHTML = "Targets a random player";
        for (let i = 0; i < labels.length; i++) {
            labels[i].style.display = "none";
        }
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
            inputs[i].style.display = "none";
        }
    }
};

// ================ KEY BINDINGS ================

setKeyBinding = (event, source) => {
    event = event || window.event;
    var charCode = event.which || event.keyCode;
    document.getElementById("key-binding").value = charCode;
    source.value = String.fromCharCode(charCode);
};

checkKeyBinding = (source) => {
    if (source.value === "") {
        document.getElementById("key-binding").value = 0;
    }
};

handleKeydown = (event) => {
    if (event.getModifierState('CapsLock')) {
        document.getElementById("caps-warning").style.display = "inline-block";
    } else {
        document.getElementById("caps-warning").style.display = "none";
    }
};

handleKeypress = (event) => {
    if (suppressHotkeys) {
        return;
    }

    event = event || window.event;
    var charCode = event.which || event.keyCode;

    if (charCode === 48) { // character '0'
        document.getElementById(`stop-all-button`).click();
        return;
    }

    if (charCode === 43) { // character '+'
        clockTap();
        return;
    }

    if (charCode === 45) { // character '-'
        // document.getElementById(`clock-restart-button`).click();
        return;
    }

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
};

// ================ CLOCK ================

updateClockBPM = (id, value) => {
    document.getElementById(id).value = Number(value);
};

changeClockSpeed = () => {
    bpm = document.getElementById("clock-bpm-input").value;
    mult = document.getElementById("clock-th-input").value;

    clockInterval = 60000 / bpm * mult;

    updateClockControls(bpm, mult);
    doSetClockSpeed(bpm, mult);
};

updateClockControls = async (bpm, mult) => {
    document.getElementById("clock-bpm-input").value = bpm;
    document.getElementById("clock-bpm-range").value = bpm;
    document.getElementById("clock-indicator").innerHTML = `${clockInterval.toFixed(3)} ms`;

    const thOptions = document.getElementById("clock-th-input").children;
    for (let i = 0; i < thOptions.length; i++) {
        const element = thOptions[i];
        if (element.value == mult) {
            element.selected = true;
        } else {
            element.selected = false;
        }
    }

    restartUIClock();
};

doWhateverTheClockDoes = (restartNow) => {
    const cName = "clock-indicator-on";
    const indicator = document.getElementById("clock-indicator");

    if (restartNow === true || !indicator.classList.contains(cName)) {
        indicator.classList.add(cName);
        activeClocks.forEach((id) => {
            document.getElementById("clock-" + id).classList.add("clock-on");
        });
    } else {
        indicator.classList.remove(cName);
        activeClocks.forEach((id) => {
            document.getElementById("clock-" + id).classList.remove("clock-on");
        });
    }
};

// The clock tap function works the following way:
// - on the third tap it starts updating the BPM count and sends it to the backend
// - it adds up to 10 taps to a queue to calculate the average of these
// - after the clock has cycled three times with the updated speed, the queue is reset
//   and it'll wait for three new taps again
clockTap = () => {
    const th = document.getElementById("clock-th-input").value;
    const now = Date.now();

    // if this is the first tap after a while, set last to now and return
    if (!clockTapLast) {
        clockTapLast = now;

        return;
    }

    const diff = now - clockTapLast;

    // if the tap queue is empty, push the first value and return
    if (clockTapMillis.length == 0) {
        clockTapMillis.push(diff);
        clockTapLast = now;

        return;
    }

    // keep at the most 10 taps in the queue to calculate the average
    if (clockTapMillis.length > 10) {
        clockTapMillis.shift();
    }

    clockTapMillis.push(diff);
    clockTapLast = now;

    const millisNew = clockTapMillis.reduce((a, b) => a + b) / clockTapMillis.length;
    const bpmNew = (60000 / millisNew * th).toFixed(1);

    clockInterval = millisNew;
    updateClockControls(bpmNew, th);
    doSetClockSpeed(bpmNew, th);

    // reset
    clearTimeout(clockTapResetTimeout);
    clockTapResetTimeout = setTimeout(() => {
        clockTapLast = undefined;
        clockTapMillis = [];
    }, millisNew * 3);
};

restartUIClock = () => {
    clearInterval(clock);
    clock = setInterval(doWhateverTheClockDoes, clockInterval);
    doWhateverTheClockDoes(true);
};

restartClock = () => doRestartClock(restartUIClock);

attachClock = (effectType, id) => {
    let action = activeClocks.has(id) ? "unsubscribe" : "subscribe";

    if (counters[id]) {
        action += "running";
        stopCounter(id);
    }

    doClockSubscription(effectType, id, action);
};

detachClockAll = () => activeClocks.forEach((id) => {
    activeClocks.delete(id);
    document.getElementById("clock-" + id).classList.remove("clock-on");
    document.getElementById("clock-" + id).classList.remove("clock-attached");
});
