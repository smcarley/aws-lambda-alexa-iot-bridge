const fs = require('fs');
const brightnessController = require('../interface/brightness-controller');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid SetBrightness request', () => {
  const request = loadRequest('BrightnessController/BrightnessController.SetBrightness.request');
  const iotData = { updateThingShadow: jest.fn().mockReturnValue({ promise: () => Promise.resolve('OK') }) };

  return brightnessController.handle(request, iotData)
    .then(response => {
      expect(iotData.updateThingShadow.mock.calls[0][0].thingName).toBe('endpoint-001');
      expect(JSON.parse(iotData.updateThingShadow.mock.calls[0][0].payload).state.desired.brightness).toBe(75);
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});
