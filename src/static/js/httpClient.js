const BASE_URL = `${window.location.origin}`;

executePreset = async (id, displayName, action) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${BASE_URL}/effects/${id}/${action}`);
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
            addToLog(action, displayName);
            counter(id, action);
        } else {
            addToLog(action, displayName, request.responseText);
        }
    });

    request.send();
}

doStatusUpdateRequest = async () => {
    const request = new XMLHttpRequest();
    request.open("GET", `${BASE_URL}/status`);
    request.addEventListener('load', () => {
        if (request.status === 200) {
            const resp = JSON.parse(request.responseText);
            updateStatus(resp.RegisteredServerCount);
        } else {
            addToLog("[BACKEND]", "Retrieve status update", request.responseText);
        }
    });

    request.send();
}
