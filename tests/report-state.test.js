const fs = require('fs');
const reportState = require('../interface/report-state');

function loadRequest(request) {
  return JSON.parse(fs.readFileSync('./tests/examples/' + request + '.json', 'utf-8'));
}

const validResponse = {
  payload: JSON.stringify({
    state: {
      desired: { powerState: "ON", brightness: 100 },
      reported: { powerState: "OFF", brightness: 100 }
    },
    metadata: { desired: { powerState: { timestamp: 1534180274 }, brightness: { timestamp: 1534180274 } }, reported: { powerState: { timestamp: 1534177275 }, brightness: { timestamp: 1534177275 } } }, version: 855, timestamp: 1534180474
  })
};

const missingReportedResponse = {
  payload: JSON.stringify({
    state: {
      desired: { powerState: "ON", brightness: 100 }
    },
    metadata: { desired: { powerState: { timestamp: 1534180274 }, brightness: { timestamp: 1534180274 } }, reported: { powerState: { timestamp: 1534177275 }, brightness: { timestamp: 1534177275 } } }, version: 855, timestamp: 1534180474
  })
};

test('valid state report', async () => {
  const request = loadRequest('StateReport/ReportState');

  const iotData = {
    getThingShadow: jest.fn().mockReturnValue(
      {
        promise: () => Promise.resolve(validResponse)
      })
  };

  const response = await reportState.handle(request, iotData);
  expect(response.event.header.name).toBe('Response');
  expect(response.context.properties[0].value).toBe('OFF');

});

test('no reported state from shadow service', async () => {
  const request = loadRequest('StateReport/ReportState');

  const iotData = {
    getThingShadow: jest.fn().mockReturnValue(
      {
        promise: () => Promise.resolve(missingReportedResponse)
      })
  };

  return await reportState.handle(request, iotData)
    .then(response => {
      expect(response.event.header.name).toBe('ErrorResponse');
    });

});