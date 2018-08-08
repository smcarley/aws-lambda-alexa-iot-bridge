const fs = require('fs');
const discover = require('../interface/discover');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

test.only('valid state report', () => {
  const request = loadRequest('Discovery/Discovery.request');

  const response = discover.handle(request)
  expect(response.event.header.name).toBe('Discover.Response');

});