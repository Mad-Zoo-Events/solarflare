const BASE_URL = `${window.location.origin}`;
const PRESETS_ENDPOINT = `${BASE_URL}/presets`
const STATUS_ENDPOINT = `${BASE_URL}/status`

executePreset = async (id, displayName, action) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${PRESETS_ENDPOINT}/${id}/${action}`);
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
    request.open("GET", STATUS_ENDPOINT);
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
