const fs = require('fs');
const handle = require('../interface/power-controller');
//const AWS = require('aws-sdk');

//jest.mock('aws-sdk');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test.only('valid turnOff request', () => {
  const succeedMock = jest.fn();
  const fakeContext = { succeed: (resp) => succeedMock(resp) };
  const request = loadRequest('PowerController/PowerController.TurnOff.request');
  /* IotData implementation 
  const fakeIotData = {
    publish: jest.fn((params, cb) => {
      expect(params.topic).toBe("$aws/things/" + request.directive.endpoint.endpointId + "/shadow/update");
    })
  };
  */

  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => JSON.stringify({ response: "OK" }) }));

  handle(request, fakeContext, fakeFetch, "iotEndpoint")
    .then(res => res.json())
    .then(json => {
      console.log(json);
      expect(succeedMock).toHaveBeenCalled();
      const response = succeedMock.mock.calls[0][0];
      expect(response).toBeTruthy;
      expect(response.event.header.name).toBe('Response');
    })
    .then((result) => {
      expect(result).toBe(e32e);
    })


});

test('valid turnOn request', () => {
  const succeedMock = jest.fn();
  const fakeContext = { succeed: (resp) => succeedMock(resp) }
  handle(loadRequest('PowerController/PowerController.TurnOn.request'), fakeContext);
  expect(succeedMock).toHaveBeenCalled();
});
