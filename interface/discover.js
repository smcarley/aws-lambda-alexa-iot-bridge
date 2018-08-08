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
                          "proactivelyReported": false,
                          "retrievable": true
                        }
                    },
                    {
                        "type": "AlexaInterface",
                        "interface": "Alexa.BrightnessController",
                        "version": "3",
                        "properties": {
                          "supported": [
                            {
                              "name": "brightness"
                            }
                          ],
                          "proactivelyReported": false,
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
    return response;
}

module.exports = handle;