var AWS = require('aws-sdk');

/*
var iot = new AWS.Iot({
    endpoint: "https://iot.eu-west-1.amazonaws.com",
    region: "eu-west-1",
    accessKeyId: "AKIAIRFDRMZEAJ5TKCSQ",
    secretAccessKey: "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"
});

iot.listThings({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
*/

var iotData = new AWS.IotData({
    endpoint: "https://a27jfyhyazu8pk.iot.eu-west-1.amazonaws.com",
    region: "eu-west-1",
    accessKeyId: "AKIAIRFDRMZEAJ5TKCSQ",
    secretAccessKey: "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"
});

iotData.getThingShadow({ thingName: 'summercourt-test-lights'}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});