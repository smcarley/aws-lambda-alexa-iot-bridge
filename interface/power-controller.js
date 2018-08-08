"use strict";

const fs = require('fs');
const https = require('https');
const log = require('../log');

function handle(request, fetch, iotEndPoint) {

    const requestMethod = request.directive.header.name;
    let shadowState = { state: { desired: { powerState: null } } };

    if (requestMethod === "TurnOn") {
        shadowState.state.desired.powerState = "ON";
    }
    else if (requestMethod === "TurnOff") {
        shadowState.state.desired.powerState = "OFF";
    }

    var response = {
        event: {
            header: {
                namespace: request.directive.header.namespace,
                name: 'Response',
                payloadVersion: 3,
                messageId: request.directive.header.messageId + "-R",
                correlationToken: request.directive.header.correlationToken
            },
            endpoint: {
                scope: {
                    type: "BearerToken",
                    token: request.directive.endpoint.scope.token
                },
                endpointId: request.directive.endpoint.endpointId
            },
            payload: {}
        }
    };

    const options = {
        method: 'POST',
        body: JSON.stringify(shadowState),
        agent: new https.Agent({
            key: fs.readFileSync('./certs/summercourt.private.key'),
            cert: fs.readFileSync('./certs/summercourt.cert.pem'),
            ca: fs.readFileSync('./certs/root-CA.crt')
        })
    };

    log.debug('Response', JSON.stringify(response));

    return fetch(`https://${iotEndPoint}:8443/things/${request.directive.endpoint.endpointId}/shadow`, options)
        .then(res => res.json())
        .then(json => {
            log.debug("result of fetch" + JSON.stringify(json));
            return response;
        });
}

module.exports = handle;