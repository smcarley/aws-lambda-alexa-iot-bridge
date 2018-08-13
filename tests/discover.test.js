const fs = require('fs');
const discover = require('../interface/discover');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

const things = { "things": [{ "thingName": "summercourt-test-lights", "thingTypeName": "Lighting", "thingArn": "arn:aws:iot:eu-west-1:182856071865:thing/summercourt-test-lights", "attributes": { "capabilities": "powerState,brightness", "friendlyName": "test_lights", "manufacturerName": "Loxone" }, "version": 4 }], "nextToken": null };

// test('valid state report', () => {
//   const request = loadRequest('Discovery/Discovery.request');

//   let fakeIot = { listThings: jest.fn((props, callback) => callback(null, things)) }; // callback straightaway

//   const response = discover.handle(request, fakeIot)
//   console.log('after handle: ' + JSON.stringify(response));
//   expect(fakeIot.listThings.mock.calls[0][0].thingTypeName).toBe('Lighting');

//   expect(response.event.header.name).toBe('Discover.Response');

// });