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

/* get shadow state example */
var response;
fetch('https://a27jfyhyazu8pk.iot.eu-west-1.amazonaws.com:8443/things/summercourt/shadow', options)
    .then(res => {
        // return res.text()
        return res.json()
    })
    .then(json => {
        json
        p = json.state.desired.powerState
        p
    }); 


/*
var response;
fetch('https://iot.eu-west-1.amazonaws.com:8443/thing-groups/test-thing-group/things?', options)
    .then(res => {
        console.log(res.status, res.statusText)
        return res.json()
    })
    .then(json => {
        console.log(json);
    }); 
    */