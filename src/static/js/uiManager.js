var activeEffects = new Map();
var activeKeys = new Map();
var activeOnbeatClocks = new Map();
var activeOffbeatClocks = new Map();

var clock;
var clockDoOnCycle = true;
var clockInterval;
var clockTapMillis = new Array();
var clockTapLast;
var clockTapResetTimeout;
var clockTapRestartTimeout;
var isClockSpeedInitiator = false;

var receiveUIUpdates = true;
var bossbarAutoUpdate = true;
var bossbarObfuscators = [];
var suppressHotkeys = false;
var hoveringOverFormattingPopup = false;

var effectDelayMillis = new Array();
var averageLatency;

// ================ PRELOADING COMPONENTS ================
var BossbarFormattingMap = new Map();

var LogWindow, StatusSocketConnection, StatusServerCount, StatusLastRequestTime, StatusAverageRequestTime;
var BossbarForm, BossbarText, BossbarPreview, BossbarColor, BossbarUpdateButton, BossbarColorFormatting, BossbarDecorationFormatting;
var CapsWarning;
var DetachAllButton, StopEverythingButton, StopAllEffectsButton;
var ClockIndicator, ClockBPMRangeInput, ClockBPMInput, ClockNoteLengthInput;
var OnBeatClockButtons = new Map();
var OffBeatClockButtons = new Map();
var StartButtons = new Map();
var StopButtons = new Map();
var StartKeyBindings = new Map();
var StopKeyBindings = new Map();
var TriggerKeyBindings = new Map();

preloadComponents = () => {
    BossbarFormattingMap = loadFormattingMap();
    LogWindow = document.getElementById("log-window");
    StatusSocketConnection = document.getElementById("status-connection-status");
    StatusServerCount = document.getElementById("status-server-count");
    StatusLastRequestTime = document.getElementById("status-last-request-time");
    StatusAverageRequestTime = document.getElementById("status-average-request-time");

    BossbarForm = document.getElementById("bossbar-form");
    BossbarText = document.getElementById("bossbar-text");
    BossbarPreview = document.getElementById("bossbar-preview");
    BossbarColor = document.getElementById("bossbar-color");
    BossbarUpdateButton = document.getElementById("bossbar-update-button");
    BossbarColorFormatting = document.getElementById("bossbar-color-formatting");
    BossbarDecorationFormatting = document.getElementById("bossbar-decoration-formatting");

    CapsWarning = document.getElementById("caps-warning");

    DetachAllButton = document.getElementById("detach-all-button");
    StopEverythingButton = document.getElementById("stop-everything-button");
    StopAllEffectsButton = document.getElementById("stop-all-effects-button");

    ClockIndicator = document.getElementById("clock-indicator");
    ClockBPMInput = document.getElementById("clock-bpm-input");
    ClockBPMRangeInput = document.getElementById("clock-bpm-range-input");
    ClockNoteLengthInput = document.getElementById("clock-note-length-input");

    var onbeatClockButtons = document.getElementsByClassName("onbeat-clock-button");
    for (let i = 0; i < onbeatClockButtons.length; i++) {
        const b = onbeatClockButtons[i];
        OnBeatClockButtons.set(b.getAttribute("effect-id"), b);
    }

    var offbeatClockButtons = document.getElementsByClassName("offbeat-clock-button");
    for (let i = 0; i < offbeatClockButtons.length; i++) {
        const b = offbeatClockButtons[i];
        OffBeatClockButtons.set(b.getAttribute("effect-id"), b);
    }

    var startButtons = document.getElementsByClassName("start-button");
    for (let i = 0; i < startButtons.length; i++) {
        const b = startButtons[i];
        StartButtons.set(b.getAttribute("effect-id"), b);

        const keyBinding = b.getAttribute("key-binding");
        if (StartKeyBindings.has(keyBinding)) {
            StartKeyBindings.get(keyBinding).push(b);
        } else {
            StartKeyBindings.set(keyBinding, [b]);
        }
    }

    var stopButtons = document.getElementsByClassName("stop-button");
    for (let i = 0; i < stopButtons.length; i++) {
        const b = stopButtons[i];
        StopButtons.set(b.getAttribute("effect-id"), b);

        const keyBinding = b.getAttribute("key-binding");
        if (StopKeyBindings.has(keyBinding)) {
            StopKeyBindings.get(keyBinding).push(b);
        } else {
            StopKeyBindings.set(keyBinding, [b]);
        }
    }

    var triggerButtons = document.getElementsByClassName("trigger-button");
    for (let i = 0; i < triggerButtons.length; i++) {
        const b = triggerButtons[i];

        const keyBinding = b.getAttribute("key-binding");
        if (!keyBinding) {
            // only command buttons support key-bindings on trigger, and thus have that attribute
            continue;
        }

        if (TriggerKeyBindings.has(keyBinding)) {
            TriggerKeyBindings.get(keyBinding).push(b);
        } else {
            TriggerKeyBindings.set(keyBinding, [b]);
        }
    }

    populateBossbarFormatting();

    document.getElementById("loading-overlay").style.display = "none";
};

window.addEventListener("load", () => {
    receiveUIUpdates = getCookie("receiveUIUpdates") !== "false";

    preloadComponents();

    if (receiveUIUpdates) {
        openWebsocket();
        document.getElementById("ui-update-checkbox").checked = true;

        clockInterval = 60000 / 128;
        updateClockControls(128, 1);
        restartUIClock();
    }
});

// ================ OTHER UI UPDATES ================

toggleUIUpdates = (checkbox) => {
    if (checkbox.checked) {
        receiveUIUpdates = true;
        openWebsocket();
    } else {
        receiveUIUpdates = false;
        updateConnectionStatus(false);
        socket.close(1000, "UI updates turned off");
    }

    setCookie("receiveUIUpdates", receiveUIUpdates, 14);
};

logEffectMessage = async (action, displayName, errMsg) => {
    const timestamp = new Date().toLocaleTimeString();
    const msg = `${action} <b>${displayName}</b> ${errMsg ? "failed: " + errMsg : "succeeded"}`;
    const logLine = `<span class="log-message">${timestamp} | <span class="${errMsg ? "failure-message" : "success-message"}">${msg}</span></span>`;

    LogWindow.innerHTML = logLine + LogWindow.innerHTML.slice(0, 2048);
};

logInfoMessage = async (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    const logLine = `<span class="log-message">${timestamp} | <span class="info-message"><b>[INFO]</b> ${msg}</span></span>`;

    LogWindow.innerHTML = logLine + LogWindow.innerHTML.slice(0, 2048);
};

clearLogs = () => LogWindow.innerHTML = "";

toggleFormattingCodePopup = () => {
    if (hoveringOverFormattingPopup) {
        return;
    }
    document.getElementById("bossbar-formatting-popup").classList.toggle("show");
};

toggleServerManagerPopup = () => {
    document.getElementById("server-manager-popup").classList.toggle("show");
};

togglebossbarAutoUpdate = (toggle) => {
    if (bossbarAutoUpdate) {
        BossbarUpdateButton.disabled = false;
        BossbarUpdateButton.classList.remove("disabled");

        toggle.classList.remove("fa-toggle-on");
        toggle.classList.add("fa-toggle-off");
        bossbarAutoUpdate = false;
    } else {
        BossbarUpdateButton.disabled = true;
        BossbarUpdateButton.classList.add("disabled");

        toggle.classList.remove("fa-toggle-off");
        toggle.classList.add("fa-toggle-on");
        bossbarAutoUpdate = true;
    }
};

// ================ STATUS UPDATE ================

updateConnectionStatus = (connected) => {
    if (connected) {
        StatusSocketConnection.innerHTML = "Connected";
        StatusSocketConnection.classList.replace("orange", "green");
    } else {
        StatusSocketConnection.innerHTML = "Disconnected";
        StatusSocketConnection.classList.replace("green", "orange");
    }
};

updateStatus = (response) => {
    const { activeServerCount, clockSpeedBpm, clockSpeedMultiplier } = response;
    StatusServerCount.innerHTML = activeServerCount;

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

    StatusLastRequestTime.innerHTML = `${millis} ms`;
    StatusAverageRequestTime.innerHTML = `${averageLatency} ms`;
};

// ================ COUNTER ================

startEffect = (id, effectType) => {
    const startButton = StartButtons.get(id);
    const stopButton = StopButtons.get(id);
    var seconds = 0;

    startButton.disabled = true;
    startButton.classList.add("disabled");
    activeEffects.set(id, {
        type: effectType,
        timer: setInterval(() => {
            seconds++;
            stopButton.innerHTML = seconds;
        }, 1000)
    });
};

stopEffect = (id) => {
    if (id === "all") {
        for (const [id, effect] of activeEffects) {
            clearInterval(effect.timer);
        }

        activeEffects.clear();
        for (const [id] of StartButtons) {
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
    const startButton = StartButtons.get(id);

    if (!startButton.disabled) {
        return;
    }

    startButton.disabled = false;
    startButton.classList.remove("disabled");

    StopButtons.get(id).innerHTML = '<i class="fas fa-stop fa-lg"></i>';
};

// ================ PRESET MANAGEMENT ================

navigate = (endpoint) => window.location.href = endpoint;

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

// ================ KEY BINDINGS ================

handleKeydown = (event) => {
    if (event.getModifierState('CapsLock')) {
        CapsWarning.style.display = "inline-block";
    } else {
        CapsWarning.style.display = "none";
    }

    if (event.which === 27) { // ESC
        DetachAllButton.click();
    }
};

handleKeypress = (event) => {
    if (suppressHotkeys) {
        return;
    }

    event = event || window.event;
    var charCode = event.which || event.keyCode;

    if (charCode === 48) { // character '0'
        StopEverythingButton.click();
    }

    if (charCode === 43) { // character '+'
        clockTap();
        return;
    }

    if (charCode === 45) { // character '-'
        StopAllEffectsButton.click();
    }

    var startStopButtons;
    if (activeKeys.has(charCode)) {
        startStopButtons = StopKeyBindings.get(`${charCode}`);
        activeKeys.delete(charCode);
    } else {
        startStopButtons = StartKeyBindings.get(`${charCode}`);
        if (startStopButtons.length > 0) {
            activeKeys.set(charCode, startStopButtons[0].getAttribute("effect-type"));
        }
    }

    for (let i = 0; i < startStopButtons.length; i++) {
        startStopButtons[i].click();
    }

    const triggerButtons = TriggerKeyBindings.get(`${charCode}`);
    for (let i = 0; i < triggerButtons.length; i++) {
        triggerButtons[i].click();
    }
};

// ================ CLOCK ================

changeClockSpeed = () => {
    bpm = parseFloat(ClockBPMInput.value);
    noteLength = parseFloat(ClockNoteLengthInput.value);

    clockInterval = 60000 / bpm * noteLength;

    updateClockControls(bpm, noteLength);
    doSetClockSpeed(bpm, noteLength);
};

updateClockControls = async (bpm, noteLength) => {
    ClockBPMInput.value = bpm;
    ClockBPMRangeInput.value = bpm;
    ClockIndicator.innerHTML = `${clockInterval.toFixed(3)} ms`;

    const thOptions = ClockNoteLengthInput.children;
    for (let i = 0; i < thOptions.length; i++) {
        const element = thOptions[i];
        if (element.value == noteLength) {
            element.selected = true;
        } else {
            element.selected = false;
        }
    }

    restartUIClock();
};

doWhateverTheClockDoes = (doOnCycle) => {
    const cName = "clock-indicator-on";
    if (doOnCycle) {
        ClockIndicator.classList.add(cName);
        for (var id of activeOnbeatClocks.keys()) {
            OnBeatClockButtons.get(id).classList.add("fas");
            OnBeatClockButtons.get(id).classList.remove("far");
        };
        for (var id of activeOffbeatClocks.keys()) {
            OffBeatClockButtons.get(id).classList.add("far");
            OffBeatClockButtons.get(id).classList.remove("fas");
        };
    } else {
        ClockIndicator.classList.remove(cName);
        for (var id of activeOnbeatClocks.keys()) {
            OnBeatClockButtons.get(id).classList.add("far");
            OnBeatClockButtons.get(id).classList.remove("fas");
        };
        for (var id of activeOffbeatClocks.keys()) {
            OffBeatClockButtons.get(id).classList.add("fas");
            OffBeatClockButtons.get(id).classList.remove("far");
        };
    }
};

// The clock tap function works the following way:
// - on the third tap it starts updating the BPM count and sends it to the backend
// - it adds up to 10 taps to a queue to calculate the average of these
// - after the clock has cycled three times with the updated speed, the queue is reset
//   and it'll wait for three new taps again
clockTap = () => {
    const noteLength = parseFloat(ClockNoteLengthInput.value);
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
    const bpmNew = parseFloat((60000 / millisNew * noteLength).toFixed(1));

    clockInterval = millisNew;
    updateClockControls(bpmNew, noteLength);
    doSetClockSpeed(bpmNew, noteLength);

    // reset
    clearTimeout(clockTapResetTimeout);
    clockTapResetTimeout = setTimeout(() => {
        clockTapLast = undefined;
        clockTapMillis = [];
    }, millisNew * 3);
};

restartUIClock = () => {
    clearInterval(clock);

    doWhateverTheClockDoes(clockDoOnCycle);

    clock = setInterval(() => {
        doWhateverTheClockDoes(clockDoOnCycle);
        clockDoOnCycle = !clockDoOnCycle;
    }, clockInterval);
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
        OffBeatClockButtons.get(id).classList.add("clock-attached");
    } else {
        if (activeOffbeatClocks.has(id)) {
            detachClockUI(id, true);
        }
        activeOnbeatClocks.set(id, effectType);
        OnBeatClockButtons.get(id).classList.add("clock-attached");
    }
};

detachClockUI = (id, isOffBeat) => {
    if (isOffBeat) {
        activeOffbeatClocks.delete(id);
        OffBeatClockButtons.get(id).classList.remove("fas");
        OffBeatClockButtons.get(id).classList.add("far");
        OffBeatClockButtons.get(id).classList.remove("clock-attached");
    } else {
        activeOnbeatClocks.delete(id);
        OnBeatClockButtons.get(id).classList.remove("far");
        OnBeatClockButtons.get(id).classList.add("fas");
        OnBeatClockButtons.get(id).classList.remove("clock-attached");
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

// ================ HELPERS ================
function setCookie(key, value, expiryDays) {
    const d = new Date();
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(key) {
    const name = `${key}=`;
    const cookies = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// ================ BOSSBAR FORMATTING ================
function loadFormattingMap() {
    return new Map([
        ["§0", { "kind": "color", "style": "color: #000000", "name": "Black" }],
        ["§1", { "kind": "color", "style": "color: #0000AA", "name": "Dark Blue" }],
        ["§2", { "kind": "color", "style": "color: #00AA00", "name": "Dark Green" }],
        ["§3", { "kind": "color", "style": "color: #00AAAA", "name": "Dark Aqua" }],
        ["§4", { "kind": "color", "style": "color: #AA0000", "name": "Dark Red" }],
        ["§5", { "kind": "color", "style": "color: #AA00AA", "name": "Dark Purple" }],
        ["§6", { "kind": "color", "style": "color: #FFAA00", "name": "Gold" }],
        ["§7", { "kind": "color", "style": "color: #AAAAAA", "name": "Gray" }],
        ["§8", { "kind": "color", "style": "color: #555555", "name": "Dark Gray" }],
        ["§9", { "kind": "color", "style": "color: #5555DD", "name": "Blue" }],
        ["§a", { "kind": "color", "style": "color: #55FF55", "name": "Green" }],
        ["§b", { "kind": "color", "style": "color: #55FFFF", "name": "Aqua" }],
        ["§c", { "kind": "color", "style": "color: #FF5555", "name": "Red" }],
        ["§d", { "kind": "color", "style": "color: #FF55FF", "name": "Light Purple" }],
        ["§e", { "kind": "color", "style": "color: #FFFF55", "name": "Yellow" }],
        ["§f", { "kind": "color", "style": "color: #FFFFFF", "name": "White" }],

        ["§k", { "kind": "decoration", "style": "", "name": "ö1%~#n" }],
        ["§l", { "kind": "decoration", "style": "font-weight: bold", "name": "Bold" }],
        ["§m", { "kind": "decoration", "style": "text-decoration: line-through", "name": "Strikethrough" }],
        ["§n", { "kind": "decoration", "style": "text-decoration: underline", "name": "Underline" }],
        ["§o", { "kind": "decoration", "style": "font-style: italic", "name": "Italic" }],
        ["§r", { "kind": "decoration", "style": "", "name": "Reset" }]
    ]);
}

function populateBossbarFormatting() {
    for (const [code, formatter] of BossbarFormattingMap) {
        const { kind, style, name } = formatter;

        switch (kind) {
            case "color":
                BossbarColorFormatting.innerHTML += `<span>${code}</span><span onclick='addFormatting("${code}");' style="${style}">${name}</span>`;
                break;
            case "decoration":
                BossbarDecorationFormatting.innerHTML += `<span>${code}</span><span onclick='addFormatting("${code}");' style="${style}">${name}</span>`;
                break;
        }
    }
}

var stopBossbarObfuscators = false;
const printableChars = ["!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "=", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"];

function bossbarObfuscate(string, elem) {
    var i = 0;
    var obsStr = string || elem.innerHTML;
    stopBossbarObfuscators = false;

    requestAnimationFrame(cycle);

    async function cycle() {
        Array.from(string).forEach((_, i) => {
            obsStr = obsStr.substr(0, i) + randomChar() + obsStr.substr(i + 1, obsStr.length);
        });

        elem.innerHTML = obsStr;

        stopBossbarObfuscators || setTimeout(() => {
            requestAnimationFrame(cycle);
        }, 50);
    }

    function randomChar() {
        return printableChars[Math.floor(Math.random() * printableChars.length)];
    }
}

function bossbarApplyCode(string, codes) {
    const elem = document.createElement('span');
    var obfuscated = false;

    string = string.replace(/\x00*/g, '');
    codes.forEach(code => {
        const { style } = BossbarFormattingMap.get(code);

        elem.style.cssText += style + ';';
        if (code === '§k') {
            bossbarObfuscate(string, elem);
            obfuscated = true;
        }
    });


    if (!obfuscated) {
        elem.innerHTML = string;
    }

    return elem;
}

function bossbarParseStyle(string) {
    var codes = string.match(/§.{1}/g) || [],
        indexes = [],
        apply = [],
        tmpStr,
        indexDelta,
        final = document.createDocumentFragment();

    for (let i = 0; i < codes.length; i++) {
        indexes.push(string.indexOf(codes[i]));
        string = string.replace(codes[i], '\x00\x00');
    }

    if (indexes[0] !== 0) {
        final.appendChild(bossbarApplyCode(string.substring(0, indexes[0]), []));
    }

    for (let i = 0; i < codes.length; i++) {
        indexDelta = indexes[i + 1] - indexes[i];
        if (indexDelta === 2) {
            while (indexDelta === 2) {
                apply.push(codes[i]);
                i++;
                indexDelta = indexes[i + 1] - indexes[i];
            }
            apply.push(codes[i]);
        } else {
            apply.push(codes[i]);
        }
        if (apply.lastIndexOf('§r') > -1) {
            apply = apply.slice(apply.lastIndexOf('§r') + 1);
        }
        tmpStr = string.substring(indexes[i], indexes[i + 1]);
        final.appendChild(bossbarApplyCode(tmpStr, apply));
    }

    return final;
}

function updateBossbarPreview() {
    stopBossbarObfuscators = true;

    var parsed = bossbarParseStyle(BossbarText.value);
    BossbarPreview.innerHTML = '';
    BossbarPreview.appendChild(parsed);
}

addFormatting = (code) => {
    const startPosition = BossbarText.selectionStart;
    const endPosition = BossbarText.selectionEnd;

    var text = BossbarText.value;
    text = text.substring(0, startPosition) + code + text.substring(startPosition);

    BossbarText.value = text;
    BossbarText.focus();
    BossbarText.setSelectionRange(startPosition + code.length, endPosition + code.length);

    updateBossbarPreview();
};
