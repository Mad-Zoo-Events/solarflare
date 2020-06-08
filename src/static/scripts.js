function addToLog(message) {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    logWindow.innerHTML = `<span class="log-message">${timestamp} | ${message}</span>` + logWindow.innerHTML;
}

sendVisualAction = async (visual, action) => {
    url = `${window.location.origin}/visuals/${visual}/${action}`;
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            addToLog(`<span class="success">${action} <b>${visual}</b> succeeded</span>`);
        } else {
            addToLog(`<span class="failure">${action} <b>${visual}</b> failed: ${request.responseText}</span>`);
        }
    });
    request.send();
}
