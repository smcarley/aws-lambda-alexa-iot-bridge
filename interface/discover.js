"use strict";

const log = require('../log');

function handle(request) {
    var payload = {
        "endpoints":
        [
            {
                "endpointId": "summercourt-test-lights",
                "manufacturerName": "Summercourt",
                "friendlyName": "test lights",
                "description": "Summercourt test endpoint",
                "displayCategories": ["LIGHT"],
                "capabilities":
                [
                    {
                      "type": "AlexaInterface",
                      "interface": "Alexa",
                      "version": "3"
                    },
                    {
                        "interface": "Alexa.PowerController",
                        "version": "3",
                        "type": "AlexaInterface",
                        "properties": {
                            "supported": [{
                                "name": "powerState"
                            }],
                             "retrievable": true
                        }
                    }
                ]
            }
        ]
    };
    var response = {
        event: {
            header : request.directive.header,
            payload: payload
        }
    }
    response.event.header.name = "Discover.Response";
    log.debug("Discovery Response: ", JSON.stringify(response));
    return response;
}

module.exports = handle;