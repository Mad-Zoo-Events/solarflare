function addToLog(message) {
    const logWindow = document.getElementById('log-window');

    const timestamp = new Date().toLocaleTimeString();
    logWindow.innerHTML = `<span class="log-message">${timestamp} | ${message}</span>` + logWindow.innerHTML;
}

sendVisualAction = async (visualType, visualName, action) => {
    const url = `${window.location.origin}/effects/${visualType}`;
    const requestBody = {
        "VisualName":visualName,
        "Action":action
    };

    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            addToLog(`<span class="success">${action} <b>${visualName}</b> succeeded</span>`);
        } else {
            addToLog(`<span class="failure">${action} <b>${visualName}</b> failed: ${request.responseText}</span>`);
        }
    });

    request.send(JSON.stringify(requestBody));
}
