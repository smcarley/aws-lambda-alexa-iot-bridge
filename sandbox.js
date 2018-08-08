const fs = require('fs');
//const handle = require('./interface/power-controller');
//const validRequest = fs.readFileSync('./tests/examples/PowerController/PowerController.TurnOff.request.json', 'utf-8');

//const succeedMock = (response) => { console.log("called with " + response) };
//const fakeContext = { succeed: (response) => succeedMock(response) }
//const fakeContext = { succeed: function(resp) { console.log(resp) }}
//const fakeContext = { succeed: (resp) => succeedMock(resp) }

//fakeContext.succeed("blibble");

//handle(validRequest, fakeContext);

/* https impl 
var https = require('https');

var options = {
    hostname: 'a27jfyhyazu8pk.iot.eu-west-1.amazonaws.com',
    path: '/things/summercourt/shadow',
    port: 8443,
    method: 'GET',
    key: fs.readFileSync('./certs/summercourt.private.key'),
    cert: fs.readFileSync('./certs/summercourt.cert.pem'),
    ca: fs.readFileSync('./certs/root-CA.crt')
};

var req = https.request(options, function (res) {
    console.log(res.statusCode);
    res.on('data', function (d) {
        process.stdout.write(d);
    });
});

req.end()
*/
var https = require('https');

//const { promisify } = require('util');
//const requestAync = promisify(https.request);

var options = {
    hostname: 'a27jfyhyazu8pk.iot.eu-west-1.amazonaws.com',
    path: '/things/summercourt/shadow',
    port: 8443,
    method: 'GET',
    key: fs.readFileSync('./certs/summercourt.private.key'),
    cert: fs.readFileSync('./certs/summercourt.cert.pem'),
    ca: fs.readFileSync('./certs/root-CA.crt')
};

// requestAync(options)
//     .then((result) => console.log(result.statusCode))

function requestAync(params) {
    return new Promise(function (resolve, reject) {
        var req = https.request(options, function (result) {
            console.log('http call completed successfully');
            resolve(result);
        });
        req.end();
    })
}

requestAync(options)
    .then((result) => {
        console.log(result.statusCode)
        result.on('data', (data) => {
            process.stdout.write(data);
            console.log(data);
        });
    });


// var req = https.request(options, function (res) {
//     console.log(res.statusCode);
//     res.on('data', function (d) {
//         process.stdout.write(d);
//     });
// });

// req.end()