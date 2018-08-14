const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./sandbox/config.json', 'utf-8'));

const AWS = require('aws-sdk');
AWS.config.loadFromPath('./sandbox/credentials-aws.json');
var iot = new AWS.Iot({ endpoint: config.aws.endpoint });


/* List things
iot.listThings({}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
*/

// iot.listThings({ thingTypeName: 'Lighting' }, function (err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else console.log(JSON.stringify(data));           // successful response
// });


/* getThingShadow 
iotData.getThingShadow({ thingName: 'summercourt-simon_study_lights'}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});*/

iotData.getThingShadow({ thingName: 'thing'}).promise().then(data => console.log(data));


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