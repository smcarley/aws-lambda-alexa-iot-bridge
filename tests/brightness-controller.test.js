const fs = require('fs');
const handle = require('../interface/brightness-controller');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid turnOff request', () => {
  const request = loadRequest('BrightnessController/BrightnessController.SetBrightness.request');
  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => {
    return { response: "OK" };
  }}));

  return handle(request, fakeFetch, "iotEndpoint")
    .then(response => {
      const brightness = JSON.parse(fakeFetch.mock.calls[0][1].body).state.desired.brightness;
      expect(brightness).toBe(75);
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});
