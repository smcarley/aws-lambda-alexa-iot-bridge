
let attributes = {
    attributes: {
        manufacturerName: 'Loxone',
        friendlyName: 'test_lights',
        description: 'test_lights',
        capabilities: 'powerState,brightness'
    }
}

console.log(JSON.stringify(attributes).split('"').join('\\"'));

