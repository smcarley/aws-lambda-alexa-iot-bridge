"use strict";

const log = require('../log');

function handle(request, context, fetch, iotEndPoint) {
    const endpointId = request.directive.endpoint.endpointId;
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
    return get(fetch, iotEndPoint, endpointId, response);
}

module.exports = handle;

function get(fetch, iotEndPoint, thingEndpointId, response) {
    const fs = require('fs');
    const https = require('https');

    const options = {
        method: 'GET',
        agent: new https.Agent({
            key: fs.readFileSync('./certs/summercourt.private.key'),
            cert: fs.readFileSync('./certs/summercourt.cert.pem'),
            ca: fs.readFileSync('./certs/root-CA.crt')
        })
    };

    return fetch(`https://${iotEndPoint}:8443/things/${thingEndpointId}/shadow`, options)
        .then(res => res.json())
        .then(json => {
            log.debug("result of fetch" + JSON.stringify(json));
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