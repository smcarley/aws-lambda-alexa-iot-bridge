const fs = require('fs');
const reportState = require('../interface/report-state');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test('valid state report', () => {
  const request = loadRequest('StateReport/ReportState');

  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => {
    return { state: { reported: { powerState: "OFF", brightness: 75 }}};
  }}));

  return reportState.handle(request, fakeFetch, 'iotEndpoint')
    .then(response => {
      expect(response.event.header.name).toBe('Response');
      expect(response.context.properties[0].value).toBe('OFF');
    });

});

test('no reported state from shadow service', () => {
  const request = loadRequest('StateReport/ReportState');

  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => {
    return { state: { desired: { powerState: "OFF" }}};
  }}));

  return reportState.handle(request, fakeFetch, 'iotEndpoint')
    .then(response => {
      expect(response.event.header.name).toBe('ErrorResponse');
    });

});