function startVisual(visual) {
    var successMessage = `<span class="success"><b>${visual}</b> has been started</span>`;
    var failureMessage = `<span class="failure"><b>${visual}</b> failed to start</span>`;
    sendRequest(visual, "start", successMessage, failureMessage);
}

function stopVisual(visual) {
    var successMessage = `<span class="success"><b>${visual}</b> has been stopped</span>`;
    var failureMessage = `<span class="failure"><b>${visual}</b> failed to stop</span>`;
    sendRequest(visual, "stop", successMessage, failureMessage);
}

function restartVisual(visual) {
    var successMessage = `<span class="success"><b>${visual}</b> has been restarted</span>`;
    var failureMessage = `<span class="failure"><b>${visual}</b> failed to restart</span>`;
    sendRequest(visual, "restart", successMessage, failureMessage);
}

function triggerVisual(visual) {
    var successMessage = `<span class="success"><b>${visual}</b> has been triggered once</span>`;
    var failureMessage = `<span class="failure"><b>${visual}</b> failed to trigger</span>`;
    sendRequest(visual, "trigger", successMessage, failureMessage);
}

function addToLog(message) {
    const logWindow = document.getElementById('logWindow');

    const timestamp = new Date().toLocaleTimeString();
    logWindow.innerHTML = `<span class="logMessage">${timestamp} | ${message}</span>` + logWindow.innerHTML;
}

sendRequest = async (visual, action, successMessage, failureMessage) => {
    url = `${window.location.origin}/visuals/${visual}/${action}`;
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            addToLog(successMessage);
        } else {
            addToLog(`${failureMessage}: ${request.responseText}`);
        }
    });
    try {
        request.send();
    } catch (error) {
        addToLog(`${failureMessage}: ${request.responseText}`);
    }
}
