const fs = require('fs');
const fetch = require('node-fetch');
const https = require('https');

const options = {
    method: 'GET',
    agent: new https.Agent({
        key: fs.readFileSync('./certs/summercourt.private.key'),
        cert: fs.readFileSync('./certs/summercourt.cert.pem'),
        ca: fs.readFileSync('./certs/root-CA.crt')
    })
};

fetch('https://a27jfyhyazu8pk.iot.eu-west-1.amazonaws.com:8443/things/summercourt/shadow', options)
    .then(res => res.json())
    .then(json => console.log(JSON.stringify(json)));