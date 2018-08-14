"use strict";

const log = require('../log');

module.exports.handle = async function handle(request, iot) {
    try {
        log.debug('Calling ListThings');
        const things = await iot.listThings({ thingTypeName: 'Lighting' }).promise()
        log.debug('ListThings responded');
        log.debug(`ListThings Success with ${things.things.length} things`)
        var payload = { "endpoints": [] };
        for (const thing of things.things) {
            let endpoint = createEndpoint(thing);
            payload.endpoints.push(endpoint);
        }

        var response = {
            event: {
                header: request.directive.header,
                payload: payload
            }
        }
        response.event.header.name = "Discover.Response";
        return response;
    } catch (err) { log.error(`ListThings Failure: ${err}`); }
}

function createEndpoint(thing) {


    const endpoint = {
        endpointId: thing.thingName,
        manufacturerName: thing.attributes.manufacturerName,
        friendlyName: thing.attributes.friendlyName.split('_').join(' '),
        description: thing.thingName,
        displayCategories: [], 
        capabilities: [
            {
                type: "AlexaInterface",
                interface: "Alexa",
                version: "3"
            }
        ]
    };

    if (thing.attributes.capabilities.includes('brightness')) {
        endpoint.displayCategories.push('LIGHT');
        endpoint.capabilities.push({
            type: "AlexaInterface",
            interface: "Alexa.BrightnessController",
            version: "3",
            properties: {
                supported: [{
                    name: "brightness"
                }],
                proactivelyReported: false,
                retrievable: true
            }
        })
    }

    if (thing.attributes.capabilities.includes('powerState')) {
        endpoint.displayCategories.push('LIGHT');
        endpoint.capabilities.push({
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
        })
    }

    return endpoint;
}