const fs = require('fs');
const handle = require('../interface/power-controller');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid turnOff request', () => {
  const request = loadRequest('PowerController/PowerController.TurnOff.request');
  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => {
    return { response: "OK" };
  }}));

  return handle(request, fakeFetch, "iotEndpoint")
    .then(response => {
      const stateSent = JSON.parse(fakeFetch.mock.calls[0][1].body).state.desired.properties[0];
      expect(stateSent.namespace).toBe('Alexa.PowerController');
      expect(stateSent.name).toBe('powerState');
      expect(stateSent.value).toBe('OFF');
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});

test('valid turnOn request', () => {
  const request = loadRequest('PowerController/PowerController.TurnOn.request');
  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => {
    return { response: "OK" };
  }}));

  return handle(request, fakeFetch, "iotEndpoint")
    .then(response => {
      const stateSent = JSON.parse(fakeFetch.mock.calls[0][1].body).state.desired.properties[0];
      expect(stateSent.namespace).toBe('Alexa.PowerController');
      expect(stateSent.name).toBe('powerState');
      expect(stateSent.value).toBe('ON');
      expect(response.event.header.namespace).toBe('Alexa');
      expect(response.event.header.name).toBe('Response');
    })
});
