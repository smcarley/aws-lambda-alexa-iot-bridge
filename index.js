"use strict";

const log = require('./log');
const discoveryHandler = require('./interface/discover');
const powerControllerHandler = require('./interface/power-controller');
const reportStateHandler = require('./interface/report-state');

const AWS = require('aws-sdk');
const iotData = new AWS.IotData({ endpoint: process.env.AWS_IOT_ENDPOINT });
const fetch = require('node-fetch');

exports.handler = function (request, context) {

    if (request.directive.header.namespace === 'Alexa.Discovery' && request.directive.header.name === 'Discover') {
        log.debug("Discover request", JSON.stringify(request));
        discoveryHandler(request, context, "");
    }
    else if (request.directive.header.namespace === 'Alexa.PowerController') {
        if (request.directive.header.name === 'TurnOn' || request.directive.header.name === 'TurnOff') {
            log.debug("TurnOn or TurnOff Request", JSON.stringify(request));
            powerControllerHandler(request, context, fetch, process.env.AWS_IOT_ENDPOINT)
                .then((result) => {
                    log.debug('TurnOn or TurnOff directive handled', JSON.stringify(result));
                    context.succeed(JSON.stringify(result))
                });
        }
    }
    else if (request.directive.header.namespace === 'Alexa') {
        if (request.directive.header.name === 'ReportState') {
            log.debug("ReportState Request", JSON.stringify(request));
            reportStateHandler(request, context, fetch, process.env.AWS_IOT_ENDPOINT)
                .then((result) => {
                    log.debug('ReportState directive handled', JSON.stringify(result));
                    context.succeed(JSON.stringify(result))
                });
        }
    }
};