const BASE_URL = `${window.location.origin}`;
const PARTICLE_ENDPOINT = `${BASE_URL}/effects/particle`;
const DRAGON_ENDPOINT = `${BASE_URL}/effects/dragon`;
const STATUS_ENDPOINT = `${BASE_URL}/status`;

sendParticleEffect = async (effectName, effectDisplayName, action) => {
    const requestBody = {
        "EffectName": effectName,
        "Action": action
    };

    doEffectRequest(
        PARTICLE_ENDPOINT,
        JSON.stringify(requestBody),
        (success, errorMsg) => {
            addToLog(action, effectDisplayName, errorMsg);
            if (success) {
                counter(effectName, action);
            }
        }
    );
}

sendDragonEffect = async (effectDisplayName, action) => {
    const floatUp = document.getElementById("dragon-float-up").checked;
    const requestBody = {
        "Action": action,
        "Static": !floatUp
    };

    doEffectRequest(
        DRAGON_ENDPOINT,
        JSON.stringify(requestBody),
        (success, errorMsg) => {
            addToLog(action, effectDisplayName, errorMsg);
            if (success) {
                counter("dragon", action);
            }
        }
    );
}

doEffectRequest = async (endpoint, payload, callback) => {
    const request = new XMLHttpRequest();
    request.open("POST", endpoint);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 300) {
            callback(true);
        } else {
            callback(false, `${request.responseText}`);
        }
    });
    request.send(payload);
}

doStatusUpdateRequest = async () => {
    const request = new XMLHttpRequest();
    request.open("GET", STATUS_ENDPOINT);
    request.addEventListener('load', () => {
        if (request.status === 200) {
            const resp = JSON.parse(request.responseText);
            updateStatus(resp.RegisteredServerCount);
        } else {
            addToLog(">>>", "Retrieve status update", request.responseText);
        }
    });
    request.send();
}
