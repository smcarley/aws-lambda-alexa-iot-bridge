const fs = require('fs');
const handle = require('../interface/power-controller');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid turnOff request', () => {
  const request = loadRequest('PowerController/PowerController.TurnOff.request');
  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => JSON.stringify({ response: "OK" }) }));

  return handle(request, fakeFetch, "iotEndpoint")
    .then(response => {
      expect(response.event.header.name).toBe('Response');
    })
});
