const fs = require('fs');
const powerController = require('../interface/power-controller');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid turnOff request', async () => {
  const request = loadRequest('PowerController/PowerController.TurnOff.request');
  const iotData = { updateThingShadow: jest.fn().mockReturnValue({ promise: () => Promise.resolve('OK') }) };

  response = await powerController.handle(request, iotData);
  expect(iotData.updateThingShadow.mock.calls[0][0].thingName).toBe('endpoint-001');
  expect(JSON.parse(iotData.updateThingShadow.mock.calls[0][0].payload).state.desired.powerState).toBe('OFF');
  expect(response.event.header.namespace).toBe('Alexa');
  expect(response.event.header.name).toBe('Response');
});

test('valid turnOn request', async () => {
  const request = loadRequest('PowerController/PowerController.TurnOn.request');
  const iotData = { updateThingShadow: jest.fn().mockReturnValue({ promise: () => Promise.resolve('OK') }) };
  return await powerController.handle(request, iotData)
    .then(response => {
      expect(iotData.updateThingShadow.mock.calls[0][0].thingName).toBe('endpoint-001');
      expect(JSON.parse(iotData.updateThingShadow.mock.calls[0][0].payload).state.desired.powerState).toBe('ON');
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});
