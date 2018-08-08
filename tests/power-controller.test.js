const fs = require('fs');
const powerController = require('../interface/power-controller');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid turnOff request', () => {
  const request = loadRequest('PowerController/PowerController.TurnOff.request');
  let fakeIotData = {updateThingShadow: jest.fn((props, callback) => callback(null, 'OK'))}; // callback straightaway

  return powerController.handle(request, fakeIotData)
    .then(response => {
      expect(fakeIotData.updateThingShadow.mock.calls[0][0].thingName).toBe('endpoint-001');
      expect(JSON.parse(fakeIotData.updateThingShadow.mock.calls[0][0].payload).state.desired.powerState).toBe('OFF');
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});

test('valid turnOn request', () => {
  const request = loadRequest('PowerController/PowerController.TurnOn.request');
  let fakeIotData = {updateThingShadow: jest.fn((props, callback) => callback(null, 'OK'))}; // callback straightaway

  return powerController.handle(request, fakeIotData)
    .then(response => {
      expect(fakeIotData.updateThingShadow.mock.calls[0][0].thingName).toBe('endpoint-001');
      expect(JSON.parse(fakeIotData.updateThingShadow.mock.calls[0][0].payload).state.desired.powerState).toBe('ON');
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});
