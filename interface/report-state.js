"use strict";

const fs = require('fs');
const https = require('https');
const log = require('../log');

function handle(request, fetch, iotEndPoint) {
    var response = {
        context: {},
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
        method: 'GET',
        agent: new https.Agent({
            key: fs.readFileSync('./certs/summercourt.private.key'),
            cert: fs.readFileSync('./certs/summercourt.cert.pem'),
            ca: fs.readFileSync('./certs/root-CA.crt')
        })
    };

    return fetch(`https://${iotEndPoint}:8443/things/${request.directive.endpoint.endpointId}/shadow`, options)
        .then(res => res.json())
        .then(json => {
            log.debug('Result of fetch json', JSON.stringify(json));
            response.context = {
                properties: [{
                    namespace: "Alexa.PowerController",
                    name: "powerState",
                    value: json.state.reported.powerState,
                    timeOfSample: new Date().toISOString(),
                    uncertaintyInMilliseconds: 0
                }]
            }
            return response;
        });
}

module.exports = handle;