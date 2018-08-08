const fs = require('fs');
const handle = require('../interface/report-state');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test.only('valid state report', () => {
  const request = loadRequest('StateReport/ReportState');

  const fakeFetch = jest.fn().mockReturnValue(Promise.resolve({ json: () => JSON.stringify({ state: { reported: { powerState: "OFF" }}})}));

  return handle(request, fakeFetch, 'iotEndpoint')
    .then(response => {
      expect(response.context.properties[0].value).toBe('OFF');
    });

});