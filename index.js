"use strict";

const log = require('./log');
const discover = require('./interface/discover');
const powerController = require('./interface/power-controller');
const brightnessController = require('./interface/brightness-controller');
const reportState = require('./interface/report-state');

exports.handler = async function (request, context, callback) {

    switch (request.directive.header.namespace) {
        case 'Alexa.Discovery':
            if (request.directive.header.name === 'Discover') {
                log.debug('Discover Request', JSON.stringify(request));
                const response = await discover.handle(request, getIot());
                log.debug("Discover Response: ", JSON.stringify(response));
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
                const response = await powerController.handle(request, getIotData())
                log.debug('TurnOn or TurnOff Response', JSON.stringify(response));
                callback(null, response);
            }
            break;
        case 'Alexa.BrightnessController':
            if (request.directive.header.name === 'AdjustBrightness' || request.directive.header.name === 'SetBrightness') {
                log.debug('AdjustBrightness or SetBrightness Request', JSON.stringify(request));
                const response = await brightnessController.handle(request, getIotData())
                log.debug('AdjustBrightness or SetBrightness Response', JSON.stringify(response));
                callback(null, response);
            }
            break;
        case 'Alexa':
            if (request.directive.header.name === 'ReportState') {
                log.debug("ReportState Request", JSON.stringify(request));
                const response = await reportState.handle(request, getIotData())
                log.debug('ReportState Repsonse', JSON.stringify(response));
                callback(null, response);
            }
            break;
        default: {
            const errorMessage = `Request with namespace ${request.directive.header.namespace} not supported`;
            log.error(errorMessage);
            callback(new Error(errorMessage));
        }
    }
}

function getIotData() {
    const AWS = require('aws-sdk');
    return new AWS.IotData({
        endpoint: `${process.env.AWS_IOTDATA_ENDPOINT}`,
        region: `${process.env.REGION}`,
        accessKeyId: `${process.env.ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`
    });
}

function getIot() {
    const AWS = require('aws-sdk');
    return new AWS.Iot({
        endpoint: `${process.env.AWS_IOT_ENDPOINT}`,
        region: `${process.env.REGION}`,
        accessKeyId: `${process.env.ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`
    });
}