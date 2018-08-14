const fs = require('fs');
const discover = require('../interface/discover');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

const things = {
  "things": [{
    "thingName": "summercourt-test-lights",
    "thingTypeName": "Lighting",
    "thingArn": "arn:aws:iot:eu-west-1:182856071865:thing/summercourt-test-lights",
    "attributes": {
      "capabilities": "powerState,brightness",
      "friendlyName": "test_lights",
      "manufacturerName": "Loxone"
    }, "version": 4
  }], "nextToken": null
};

test('valid turnOff request', async () => {
  const request = loadRequest('Discovery/Discovery.request');
  const iot = { listThings: jest.fn().mockReturnValue({ promise: () => Promise.resolve(things) }) };

  const response = await discover.handle(request, iot);
  expect(iot.listThings.mock.calls[0][0].thingTypeName).toBe('Lighting');
  expect(response.event.header.namespace).toBe('Alexa.Discovery');
  expect(response.event.header.name).toBe('Discover.Response');
  expect(response.event.payload.endpoints.length).toBe(1);
  expect(response.event.payload.endpoints[0].friendlyName).toBe('test lights');
});