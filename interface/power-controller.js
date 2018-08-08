"use strict";

const log = require('../log');

function handle(request, context, fetch, iotEndPoint) {

    var requestMethod = request.directive.header.name;
    
    let shadowState = { state: { desired: { powerState: null } } };

    if (requestMethod === "TurnOn") {
        shadowState.state.desired.powerState = "ON";
    }
    else if (requestMethod === "TurnOff") {
        shadowState.state.desired.powerState = "OFF";
    }

    var response = {
        //context: contextResult,
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
    log.debug('Response', JSON.stringify(response));

    return post(fetch, shadowState, iotEndPoint, request.directive.endpoint.endpointId, response);

    /* HTTP node-fetch implementation - requires authenticaiton
    const url = `https://${iotEndPoint}:8443/things/${request.directive.endpoint.endpointId}/shadow`;
    log.debug('url: ' + url);
    log.debug('state: ' + JSON.stringify(shadowState));
    return fetch(url, { method: 'POST', body: JSON.stringify(shadowState) })
        .then(response => response.json())
        .then(json => log.debug('Shadow Update response ' + JSON.stringify(json)))
        .catch(log.error);
     */



    /* MQTT implementation 
    let params = {
        topic: "$aws/things/" + request.directive.endpoint.endpointId + "/shadow/update",
        payload: JSON.stringify(shadowState)
    };

    log.debug(`publishing state to: ${params.topic}`);
    log.debug('state: ' + params.payload);

    function publishIotData(params) {
        return new Promise(function(resolve, reject) {
            iotData.publish(params, function(error, result) {
                if (error) { reject(error)}
                else {
                    log.debug('published state successfully: ' + JSON.stringify(result));
                    resolve(result);
                }
            });
        })
    }
    return publishIotData(params);    
    */

    // const callback = (err, res) => {
    //     if (err) return log.error('failed to publish: ' + err);
    //     log.debug('published state successfully: ' + JSON.stringify(res));
    // }
    // iotData.publish(params, callback);


    // var contextResult = {
    //     "properties": [{
    //         "namespace": "Alexa.PowerController",
    //         "name": "powerState",
    //         "value": shadowState.state.desired.powerState,
    //         "timeOfSample": "2017-09-03T16:20:50.52Z", //retrieve from result.
    //         "uncertaintyInMilliseconds": 50
    //     }]
    // };

    // context.succeed(response);
}

module.exports = handle;

function get(fetch, iotEndPoint, thingEndpointId, response) {
    return f('GET', null, fetch, iotEndPoint, thingEndpointId, response)
}

function post(fetch, state, iotEndPoint, thingEndpointId, response) {
    return f('POST', JSON.stringify(state), fetch, iotEndPoint, thingEndpointId, response)
}

function f(method, body, fetch, iotEndPoint, thingEndpointId, response) {
    const fs = require('fs');
    const https = require('https');

    const options = {
        method: method,
        body: body,
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
            return response;
        });
}