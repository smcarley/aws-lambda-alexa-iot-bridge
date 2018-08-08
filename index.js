"use strict";

const log = require('./log');
const discoveryHandler = require('./interface/discover');
const powerControllerHandler = require('./interface/power-controller');
const reportStateHandler = require('./interface/report-state');

const AWS = require('aws-sdk');
const iotData = new AWS.IotData({ endpoint: process.env.AWS_IOT_ENDPOINT });
const fetch = require('node-fetch');

exports.handler = function (request, context, callback) {

    switch (request.directive.header.namespace) {
        case 'Alexa.Discovery':
            if (request.directive.header.name === 'Discover') {
                log.debug('Discover request', JSON.stringify(request));
                const response = discoveryHandler(request);
                callback(null, response);
                break;
            }
            else {
                log.debug(`Alexa.Discovery request of type ${request.directive.header.name} not handled`);
            }
            break;
        case 'Alexa.PowerController':
            if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
                log.debug('TurnOn or TurnOff Request', JSON.stringify(request));
                powerControllerHandler(request, fetch, process.env.AWS_IOT_ENDPOINT)
                    .then(response => {
                        log.debug('TurnOn or TurnOff Response', JSON.stringify(response));
                        callback(null, response);
                    });
            }
            break;
        case 'Alexa':
            if (request.directive.header.name === 'ReportState') {
                log.debug("ReportState Request", JSON.stringify(request));
                reportStateHandler(request, fetch, process.env.AWS_IOT_ENDPOINT)
                    .then(response => {
                        log.debug('ReportState Repsonse', JSON.stringify(response));
                        callback(null, response);
                    });
            }
            break;
        default: {
            const errorMessage = `Request with namespace ${request.header.namespace} not supported`;
            log.error(errorMessage);
            callback(new Error(errorMessage));
        }
    }
}