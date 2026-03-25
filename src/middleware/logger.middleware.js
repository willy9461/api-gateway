const morgan = require('morgan');

const format = ':method :url :status :res[content-length] - :response-time ms';

module.exports = morgan(format);