"use strict";

const fs = require('fs');
const https = require('https');

module.exports.createAgent = function createAgent() {
    return new https.Agent({
        key: fs.readFileSync('./certs/summercourt.private.key'),
        cert: fs.readFileSync('./certs/summercourt.cert.pem'),
        ca: fs.readFileSync('./certs/root-CA.crt')});
}