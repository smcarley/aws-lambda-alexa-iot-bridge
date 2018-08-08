"use strict";

const log = require('../log');

module.exports.handle = function handle(request, iot) {

    let discoverResponse = iot.listThings({ thingTypeName: 'Lighting' }, function (err, data) {
        if (err) log.error('ListThings error', err, err.stack);
        else {
            log.debug(`ListThings Success: ${data.things.length}`)
            var payload = { "endpoints": [] };
            data.things.forEach(thing => {
                let endpoint = {
                    endpointId: thing.thingName,
                    manufacturerName: thing.attributes.manufacturerName,
                    friendlyName: thing.attributes.friendlyName.split('_').join(' '), // refactor this
                    description: thing.thingName,
                    displayCategories: ['LIGHT'],
                    capabilities: [  // auto-gen this
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
                payload.endpoints.push(endpoint);
            });

            var response = {
                event: {
                    header: request.directive.header,
                    payload: payload
                }
            }
            response.event.header.name = "Discover.Response";
            return response;
        }
    });
    return discoverResponse;
}