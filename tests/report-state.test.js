const fs = require('fs');
const handle = require('../interface/report-state');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid turnOff request', () => {
  const succeedMock = jest.fn();
  const fakeContext = { succeed: (resp) => succeedMock(resp) };
  const request = loadRequest('StateReport/ReportState');

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
