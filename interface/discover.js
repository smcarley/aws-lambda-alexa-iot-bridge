"use strict";

const log = require('../log');

module.exports.handle = function handle(request, iot) {

    return new Promise((resolve, reject) => {
        log.debug('Calling ListThings');
        iot.listThings({ thingTypeName: 'Lighting' }, function (err, data) {
            log.debug('ListThings responded');
            
            if (err) {
                const reason = `ListThings Failure: ${err}`;
                log.error(reason);
                reject(reason);
            }
            else {
                log.debug(`ListThings Success: ${data.things.length}`)
                var payload = { "endpoints": [] };
                data.things.forEach(thing => {
                    let endpoint = createEndpoint(thing);
                    payload.endpoints.push(endpoint);
                });

                var response = {
                    event: {
                        header: request.directive.header,
                        payload: payload
                    }
                }
                response.event.header.name = "Discover.Response";
                resolve(response);
            }
        });
    });
}

function createEndpoint(thing) {
    return {
        endpointId: thing.thingName,
        manufacturerName: thing.attributes.manufacturerName,
        friendlyName: thing.attributes.friendlyName.split('_').join(' '),
        description: thing.thingName,
        displayCategories: ['LIGHT'],
        capabilities: [
            {
                type: "AlexaInterface",
                interface: "Alexa",
                version: "3"
            },
            {
                interface: "Alexa.PowerController",
                version: "3",
                type: "AlexaInterface",
                properties: {
                    supported: [{
                        name: "powerState"
                    }],
                    proactivelyReported: false,
                    retrievable: true
                }
            },
            {
                type: "AlexaInterface",
                interface: "Alexa.BrightnessController",
                version: "3",
                properties: {
                    supported: [
                        {
                            name: "brightness"
                        }
                    ],
                    proactivelyReported: false,
                    retrievable: true
                }
            }
        ]
    };
}
