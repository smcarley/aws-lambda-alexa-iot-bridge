"use strict";

const log = require('../log');

function handle(request, context) {
    var payload = {
        "endpoints":
        [
            {
                "endpointId": "summercourt",
                "manufacturerName": "Summercourt",
                "friendlyName": "Summercourt",
                "description": "Summercourt test endpoint",
                "displayCategories": ["SWITCH"],
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
    var header = request.directive.header;
    header.name = "Discover.Response";
    log.debug("Discovery Response: ", JSON.stringify({ header: header, payload: payload }));
    context.succeed({ event: { header: header, payload: payload } });
}

module.exports = handle;