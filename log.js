/**
 * Logging helpers for lambda
 * Set enviroment variable LOG_LEVEL to one of the following LEVELS to control
 * verbosity of logging.
 */

var LEVELS = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
];

var DEFAULT = 'DEBUG';

function log(level, message) {
    var setLevel = LEVELS.indexOf(process.env.LOG_LEVEL ?
        process.env.LOG_LEVEL : DEFAULT);
    if (LEVELS.indexOf(level) < setLevel) {
        return;
    }
    switch (level) {
    case 'INFO':
        console.info(message);
        break;
    case 'WARN':
        console.warn(message);
        break;
    case 'ERROR':
        console.error(message);
        break;
    default: // debug, trace
        console.log(message);
        break;
    }
}

function createMsg(args) {
    return Array.prototype.slice.apply(args).join(' ');
}

module.exports.trace = function() {
    log('TRACE', createMsg(arguments));
};
module.exports.debug = function() {
    log('DEBUG', createMsg(arguments));
};
module.exports.info = function() {
    log('INFO', createMsg(arguments));
};
module.exports.warn = function() {
    log('WARN', createMsg(arguments));
};
module.exports.error = function() {
    log('ERROR', createMsg(arguments));
};