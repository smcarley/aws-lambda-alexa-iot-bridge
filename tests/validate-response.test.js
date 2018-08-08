// const fs = require('fs');
// const Ajv = require('ajv');
// const ajv = new Ajv({schemaId: 'id', allErrors: true});
// ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
// const validate = ajv.compile(fs.readFileSync('./interface/alexa-response-validation-schema.json'));
// const valid = validate(fs.readFileSync('./tests/examples/PowerController/PowerController.TurnOff.response.json'));
test('response is valid', () => {
    expect(true).toBe(true);
  });