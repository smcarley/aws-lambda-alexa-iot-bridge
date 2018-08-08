"use strict";

const log = require('../log');
const util = require('../util');

function handle(request, fetch, iotEndPoint) {

    const options = {
        method: 'POST',
        body: JSON.stringify(constructDesiredState(request)),
        agent: util.createAgent()
    };

    return fetch(`https://${iotEndPoint}:8443/things/${request.directive.endpoint.endpointId}/shadow`, options)
        .then(res => res.json())
        .then(json => {
            log.debug("Result of fetch", JSON.stringify(json));
            return constructResponse(request);
        });
}

module.exports = handle;

function constructDesiredState(request) {
    return {
        state: {
            desired: {
                brightness: request.directive.payload.brightness
            }
        }
    };
}

function constructResponse(request) {
    return {
        event: {
            header: {
                namespace: 'Alexa',
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
}