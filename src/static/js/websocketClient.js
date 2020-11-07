var socket;

window.onbeforeunload = function () {
    if (socket) {
        socket.onclose = function () { }; // disable onclose handler first
        socket.close();
    }
};

openWebsocket = () => {
    if (location.hostname === "localhost") {
        socket = new WebSocket(`ws://localhost:5000/socket`);
    } else {
        socket = new WebSocket(`wss://${window.location.host}/socket`);
    }

    socket.onopen = () => {
        updateConnectionStatus(true);
    };
    socket.onclose = (event) => {
        if (receiveUIUpdates) {
            logInfoMessage(`Disconnected from UI updates... Attempting reconnect`);
            updateConnectionStatus(false);
            setTimeout(openWebsocket, 1000);
        }
    };
    socket.onerror = () => {
        logInfoMessage(`Error with the UI update connection`);
        updateConnectionStatus(false);
    };

    socket.onmessage = (e) => handleMessage(JSON.parse(e.data));
};

handleMessage = async (data) => {
    const {
        effectUpdate,
        bossbarUpdate,
        clockUpdate,
        clockSpeedUpdate,
        statusUpdate,
        stageUpdate,
        commandUpdate
    } = data;

    if (effectUpdate) {
        const { id, effectType, displayName, action, errorMessage, stopAll } = effectUpdate;

        if (stopAll) {
            const { stopEffects, detachClocks, specificTypeOnly } = stopAll;

            if (detachClocks) {
                detachClockAll(specificTypeOnly);
            }

            if (stopEffects) {
                stopEffectsAll(specificTypeOnly);
            }

            [DetachAllButton, StopEverythingButton, StopAllEffectsButton].forEach(button => {
                button.disabled = false;
                button.classList.remove("disabled");
            });

            logEffectMessage("=>", "STOP ALL");
        } else {
            if (!errorMessage && action !== "trigger") {
                if (action === "start") {
                    startEffect(id, effectType);
                } else if (action === "stop") {
                    stopEffect(id);
                }
            }

            logEffectMessage(action, displayName, errorMessage);
        }
    };

    if (bossbarUpdate) {
        const { text, color, action } = bossbarUpdate;
        if (action === "set") {
            BossbarText.value = text;
            BossbarColor.value = color;
        } else {
            BossbarText.value = "";
        }

        updateBossbarPreview();
    }

    if (clockUpdate) {
        const { id, effectType, isOffBeat, action } = clockUpdate;

        switch (action) {
            case "subscribe":
                attachClockUI(id, effectType, isOffBeat);
                break;
            case "unsubscribe":
                detachClockUI(id, isOffBeat);
                break;
        }
    }

    if (clockSpeedUpdate) {
        // if the request to change the clock speed came from this host
        // then no UI update is needed, so reset the flag and return
        if (isClockSpeedInitiator) {
            isClockSpeedInitiator = false;
            return;
        }

        const { clockSpeedBpm, clockSpeedMultiplier } = clockSpeedUpdate;

        clockInterval = 60000 / clockSpeedBpm * clockSpeedMultiplier;
        updateClockControls(clockSpeedBpm, clockSpeedMultiplier);
        restartUIClock();
    }

    if (statusUpdate) {
        const { activeServerIDs } = statusUpdate;
        const activeServerCount = activeServerIDs.length;

        const checkboxes = document.getElementsByClassName("server-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i];
            if (activeServerIDs.includes(checkbox.name)) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        }

        StatusServerCount.innerHTML = activeServerCount;
        logInfoMessage(`Server list updated - ${activeServerCount} ${activeServerCount === 1 ? "instance is" : "instances are"} now connected`);
    }

    if (stageUpdate) {
        window.location.reload();
    }

    if (commandUpdate) {
        const { command, errorMessage } = commandUpdate;

        logEffectMessage("run command", command, errorMessage);
    }
};
