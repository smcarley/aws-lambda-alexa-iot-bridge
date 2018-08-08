var AWS = require('aws-sdk');


var iot = new AWS.Iot({
    endpoint: "https://iot.eu-west-1.amazonaws.com",
    region: "eu-west-1",
    accessKeyId: "AKIAIRFDRMZEAJ5TKCSQ",
    secretAccessKey: "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"
});

/* List things
iot.listThings({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
*/

iot.listThings({ thingTypeName: 'Lighting' }, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(JSON.stringify(data));           // successful response
});


/*
var iotData = new AWS.IotData({
    endpoint: "https://a27jfyhyazu8pk.iot.eu-west-1.amazonaws.com",
    region: "eu-west-1",
    accessKeyId: "AKIAJ533DXDPNAMTXCXA",
    secretAccessKey: "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"
});
*/

/* getThingShadow
iotData.getThingShadow({ thingName: 'summercourt-test-lights'}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
*/

/* updateThingShadow with promise
new Promise((resolve, reject) => {
    iotData.updateThingShadow({
        thingName: 'summercourt-test-lights',
        payload: JSON.stringify({
            state: {
                desired: {
                    powerState: "ON",
                    brightness: 45
                },
                reported: {
                    powerState: "ON",
                    brightness: 45
                }
            }
        })
    }, function (err, data) {
        if (err) {
            const reason = `UpdateThingShadow Failure: ${err}`;
            console.log(reason);
            reject(reason);
        }
        else {
            console.log(`UpdateThingShadow Success`);
            resolve(data);
        }
    })
})
    .then((res) => JSON.stringify(res))
    .then(json =>
        console.log(`Promise Complete: ${json}`)
    )
console.log('After promise')
*/

/* updateThingShadow - non-promise
let res = iotData.updateThingShadow({
    thingName: 'summercourt-test-lights',
    payload: JSON.stringify({
        state: {
            desired: {
                powerState: "ON",
                brightness: 45
            },
            reported: {
                powerState: "ON",
                brightness: 45
            }
        }
    })
}, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log('Callback response: ' + JSON.stringify(data));           // successful response
});

console.log('Result from updateThingShadow')
*/