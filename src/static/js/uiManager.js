const CLOCK_SYNC_INTERVAL = 10000;

var activeEffects = new Map();
var activeKeys = new Map();
var activeOnbeatClocks = new Map();
var activeOffbeatClocks = new Map();

var clock;
var clockInterval;
var clockTapMillis = new Array();
var clockTapLast;
var clockTapResetTimeout;
var clockTapRestartTimeout;
var isClockSpeedInitiator = false;

var bossbarAutoUpdate = true;
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

clearLogs = () => document.getElementById("log-window").innerHTML = "";

toggleFormattingCodePopup = () => {
    if (hoveringOverFormattingPopup) {
        return;
    }
    document.getElementById("bossbar-formatting-popup").classList.toggle("show");
};

addFormatting = (code) => {
    document.getElementById("bossbar-text").value += code;
};

toggleServerManagerPopup = () => {
    document.getElementById("server-manager-popup").classList.toggle("show");
};

togglebossbarAutoUpdate = (toggle) => {
    const updateButton = document.getElementById("bossbar-update-button");
    if (bossbarAutoUpdate) {
        updateButton.disabled = false;
        updateButton.classList.remove("disabled");

        toggle.classList.remove("fa-toggle-on");
        toggle.classList.add("fa-toggle-off");
        bossbarAutoUpdate = false;
    } else {
        updateButton.disabled = true;
        updateButton.classList.add("disabled");

        toggle.classList.remove("fa-toggle-off");
        toggle.classList.add("fa-toggle-on");
        bossbarAutoUpdate = true;
    }
};

// ================ STATUS UPDATE ================

updateStatus = (response) => {
    const { activeServerCount, clockSpeedBpm, clockSpeedMultiplier } = response;
    document.getElementById('status-server-count').innerHTML = activeServerCount;

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

startEffect = (id, effectType) => {
    const startButton = document.getElementById(`start-${id}`);
    const stopButton = document.getElementById(`stop-${id}`);
    var seconds = 0;

    startButton.disabled = true;
    startButton.classList.add("disabled");
    activeEffects.set(id, {
        type: effectType,
        timer: setInterval(() => {
            seconds++;
            requestAnimationFrame(() => stopButton.innerHTML = seconds);
        }, 1000)
    });
};

stopEffect = (id) => {
    if (id === "all") {
        for (const [id, effect] of activeEffects) {
            clearInterval(effect.timer);
        }

        activeEffects.clear();
        const buttons = document.getElementsByClassName("start");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const id = button.id.replace('start-', '');
            resetStartButton(id);
        }

        return;
    }

    if (!activeEffects.has(id)) {
        return;
    }

    clearInterval(activeEffects.get(id).timer);
    activeEffects.delete(id);

    resetStartButton(id);
};

resetStartButton = async (id) => {
    const startButton = document.getElementById(`start-${id}`);
    const stopButton = document.getElementById(`stop-${id}`);

    if (!startButton.disabled) {
        return;
    }

    startButton.disabled = false;
    startButton.classList.remove("disabled");
    stopButton.innerHTML = '<i class="fas fa-stop fa-lg"></i>';
};

// ================ PRESET MANAGEMENT ================

syncValue = (targetId, val) => {
    document.getElementById(targetId).value = val;
};

confirmDelete = (id, effectType, displayName) => {
    const r = confirm(`WARNING!\nAre you sure you want to delete "${displayName}"?`);
    if (r === true) {
        doDeletePreset(id, effectType);
    }
};

addEffectInput = () => {
    const effectBoxes = document.getElementsByClassName("effect-box");
    const next = Number(effectBoxes[effectBoxes.length - 1].getAttribute("data-index")) + 1;
    const form = document.getElementById("preset-form");
    const newEffectsHolder = effectBoxes[0].cloneNode(true);

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

    newEffectsHolder.setAttribute("data-index", next);

    form.appendChild(newEffectsHolder);
};

removeEffectInput = (element) => {
    if (document.getElementsByClassName("effect-box").length > 1) {
        element.parentNode.parentNode.remove();
    } else {
        alert("Gotta keep at least one effect!\n(what's the point otherwise!?)");
    }
};

updateRangeValue = (targetId, range) => {
    const index = range.getAttribute("data-index");
    const id = `${targetId}-${index}`;
    document.getElementById(id).value = range.value;
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

onPasteKeyBinding = (event, source) => {
    event.clipboardData.items[0].getAsString(function (s) {
        if (s === "") {
            document.getElementById("key-binding").value = 0;
            return;
        }
        var charCode = s.charCodeAt(0);
        document.getElementById("key-binding").value = charCode;
        source.value = String.fromCharCode(charCode);
    });
};

onKeypressKeyBinding = (event, source) => {
    var charCode = event.which;
    if (!charCode) {
        document.getElementById("key-binding").value = 0;
        return;
    }
    document.getElementById("key-binding").value = charCode;
    source.value = String.fromCharCode(charCode);
};

handleKeydown = (event) => {
    if (event.getModifierState('CapsLock')) {
        document.getElementById("caps-warning").style.display = "inline-block";
    } else {
        document.getElementById("caps-warning").style.display = "none";
    }

    if (event.which === 27) { // ESC
        document.getElementById(`detach-all-button`).click();
    }
};

handleKeypress = (event) => {
    if (suppressHotkeys) {
        return;
    }

    event = event || window.event;
    var charCode = event.which || event.keyCode;

    if (charCode === 48) { // character '0'
        document.getElementById(`stop-everything-button`).click();
    }

    if (charCode === 43) { // character '+'
        clockTap();
        return;
    }

    if (charCode === 45) { // character '-'
        document.getElementById(`stop-all-effects-button`).click();
    }

    var startStopButtons;
    if (activeKeys.has(charCode)) {
        startStopButtons = document.getElementsByClassName(`stop key-binding-${charCode}`);
        activeKeys.delete(charCode);
    } else {
        startStopButtons = document.getElementsByClassName(`start key-binding-${charCode}`);
        if (startStopButtons.length > 0) {
            activeKeys.set(charCode, startStopButtons[0].getAttribute("effect-type"));
        }
    }

    for (let i = 0; i < startStopButtons.length; i++) {
        startStopButtons[i].click();
    }

    const triggerButtons = document.getElementsByClassName(`trigger key-binding-${charCode}`);
    for (let i = 0; i < triggerButtons.length; i++) {
        triggerButtons[i].click();
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

doWhateverTheClockDoes = () => {
    const cName = "clock-indicator-on";
    const indicator = document.getElementById("clock-indicator");

    if (!indicator.classList.contains(cName)) { // ON
        indicator.classList.add(cName);
        for (var id of activeOnbeatClocks.keys()) {
            document.getElementById("onbeatclock-" + id).classList.add("fas");
            document.getElementById("onbeatclock-" + id).classList.remove("far");
        };
        for (var id of activeOffbeatClocks.keys()) {
            document.getElementById("offbeatclock-" + id).classList.add("far");
            document.getElementById("offbeatclock-" + id).classList.remove("fas");
        };
    } else { // OFF
        indicator.classList.remove(cName);
        for (var id of activeOnbeatClocks.keys()) {
            document.getElementById("onbeatclock-" + id).classList.add("far");
            document.getElementById("onbeatclock-" + id).classList.remove("fas");
        };
        for (var id of activeOffbeatClocks.keys()) {
            document.getElementById("offbeatclock-" + id).classList.add("fas");
            document.getElementById("offbeatclock-" + id).classList.remove("far");
        };
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
    clock = setInterval(() => requestAnimationFrame(doWhateverTheClockDoes), clockInterval);
    requestAnimationFrame(() => doWhateverTheClockDoes(true));
};

restartClock = () => doRestartClock(restartUIClock);

attachClock = (effectType, id, isOffbeat) => {
    let action;
    if (isOffbeat) {
        action = activeOffbeatClocks.has(id) ? "unsubscribe" : "subscribe";
    } else {
        action = activeOnbeatClocks.has(id) ? "unsubscribe" : "subscribe";
    }

    let isRunning = false;

    if (activeEffects.has(id)) {
        isRunning = true;
        stopEffect(id);
    }

    doClockSubscription(effectType, id, action, isRunning, isOffbeat);
};

attachClockUI = (id, effectType, isOffBeat) => {
    if (isOffBeat) {
        if (activeOnbeatClocks.has(id)) {
            detachClockUI(id, false);
        }
        activeOffbeatClocks.set(id, effectType);
        document.getElementById("offbeatclock-" + id).classList.add("clock-attached");
    } else {
        if (activeOffbeatClocks.has(id)) {
            detachClockUI(id, true);
        }
        activeOnbeatClocks.set(id, effectType);
        document.getElementById("onbeatclock-" + id).classList.add("clock-attached");
    }
};

detachClockUI = (id, isOffBeat) => {
    if (isOffBeat) {
        activeOffbeatClocks.delete(id);
        document.getElementById("offbeatclock-" + id).classList.remove("fas");
        document.getElementById("offbeatclock-" + id).classList.add("far");
        document.getElementById("offbeatclock-" + id).classList.remove("clock-attached");
    } else {
        activeOnbeatClocks.delete(id);
        document.getElementById("onbeatclock-" + id).classList.remove("far");
        document.getElementById("onbeatclock-" + id).classList.add("fas");
        document.getElementById("onbeatclock-" + id).classList.remove("clock-attached");
    }
};

detachClockAll = (specificTypeOnly) => {
    for (const [id, effectType] of activeOnbeatClocks) {
        if (!specificTypeOnly || specificTypeOnly == effectType) {
            detachClockUI(id, false);
        }
    }
    for (const [id, effectType] of activeOffbeatClocks) {
        if (!specificTypeOnly || specificTypeOnly == effectType) {
            detachClockUI(id, true);
        }
    }
};

stopEffectsAll = (specificTypeOnly) => {
    if (!specificTypeOnly) {
        activeKeys.clear();
        stopEffect("all");
        clearLogs();
        return;
    }

    for (const [id, effectType] of activeKeys) {
        if (specificTypeOnly === effectType) {
            activeKeys.delete(id);
        }
    }

    for (const [id, effect] of activeEffects) {
        if (specificTypeOnly === effect.type) {
            stopEffect(id);
        }
    }
};