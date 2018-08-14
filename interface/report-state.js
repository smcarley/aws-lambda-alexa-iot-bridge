"use strict";

const log = require('../log');

module.exports.handle = async function handle(request, iotData) {

    const shadow = await iotData.getThingShadow({ thingName: request.directive.endpoint.endpointId }).promise();
    log.debug('Thing Shadow State', JSON.stringify(shadow));
    const shadowState = JSON.parse(shadow.payload)
    if (shadowState.state.reported) {
        return constructReponse(request, shadowState);
    } else {
        return constructErrorResponse(request);
    }
};

function constructErrorResponse(request) {
    return {
        event: {
            header: {
                namespace: 'Alexa',
                name: 'ErrorResponse',
                messageId: request.directive.header.messageId + "-R",
                correlationToken: request.directive.header.correlationToken,
                payloadVersion: 3,
            }
        },
        endpoint: {
            endpointId: request.directive.endpoint.endpointId
        },
        payload: {
            type: "ENDPOINT_UNREACHABLE",
            message: `No state available for endpoint ${request.directive.endpoint.endpointId}`
        }
    };
}

function constructReponse(request, shadowState) {
    return {
        context: {
            properties: [{
                namespace: "Alexa.PowerController",
                name: "powerState",
                value: shadowState.state.reported.powerState,
                timeOfSample: new Date().toISOString(),
                uncertaintyInMilliseconds: 0
            }]
        },
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
};