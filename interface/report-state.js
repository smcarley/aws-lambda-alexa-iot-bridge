"use strict";

const fs = require('fs');
const https = require('https');
const log = require('../log');

function handle(request, fetch, iotEndPoint) {
    
    const options = {
        method: 'GET',
        agent: new https.Agent({
            key: fs.readFileSync('./certs/summercourt.private.key'),
            cert: fs.readFileSync('./certs/summercourt.cert.pem'),
            ca: fs.readFileSync('./certs/root-CA.crt')
        })
    };

    return fetch(`https://${iotEndPoint}:8443/things/${request.directive.endpoint.endpointId}/shadow`, options)
        .then(res => res.json())
        .then(shadowStateJson => {
            log.debug('Result of fetch json', JSON.stringify(shadowStateJson));
            if (shadowStateJson.state.reported) {
                return constructReponse(request, shadowStateJson);
            } else {
                return constructErrorResponse(request);
            }
        });
};

module.exports = handle;



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