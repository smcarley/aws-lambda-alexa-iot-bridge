"use strict";

const log = require('../log');
const util = require('../util');

module.exports.handle = async function handle(request, iotData) {

    try {
        var resp = await iotData.updateThingShadow({
            thingName: request.directive.endpoint.endpointId,
            payload: JSON.stringify(constructDesiredState(request))
        }).promise();
        log.debug(`UpdateThingShadow Success: ${resp}`);
        return constructResponse(request);
    } catch (err) { log.error(`UpdateThingShadow Failure: ${err}`); }
}

/* This will only work for lighting */
function constructDesiredState(request) {
    return {
        state: {
            desired: {
                powerState: request.directive.header.name === "TurnOn" ? "ON" : "OFF",
                brightness: request.directive.header.name === "TurnOn" ? 100 : 0
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